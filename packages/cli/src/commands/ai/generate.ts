import fs from "fs";
import { resolve } from "path";
import { getApi } from "../../utils/api.js";
import { execSync } from "child_process";
import { getDefaultBranch, getGithubOrgandRepo } from "../../utils/git";
import { generateSideNav } from "../../utils/sideNavGenerator.js";
const clackImport = import("@clack/prompts");
const chalkImport = import("chalk").then((m) => m.default);

function listMostRecentGitBranches(gitRepoPath: string) {
  try {
    const gitBranchCommand = `git -C ${gitRepoPath} for-each-ref --sort='-committerdate' --format="%(refname:short)" refs/heads`;

    const branchList = execSync(gitBranchCommand, { encoding: "utf-8" });
    const recentBranches = branchList.trim().split("\n").slice(0, 10);

    return recentBranches;
  } catch (error: any) {
    console.error("Error:", error.message);
    return [];
  }
}

export async function generate() {
  const clack = await clackImport;
  const chalk = await chalkImport;

  const data = fs.readFileSync(".floe/config.json", "utf8");
  const config = JSON.parse(data);

  if (!config) {
    console.log("No Floe config found");
    process.exit(0);
  }

  clack.intro("ai generate");

  await clack.group(
    {
      branchSelect: async () => {
        const selection = await clack.select({
          message: "Select a branch for content generation:",
          options: listMostRecentGitBranches(process.cwd()).map((branch) => ({
            value: branch,
            label: branch,
          })),
        });

        return selection;
      },

      /**
       * Select a template
       */
      // ...
      selectTemplate: async () => {
        if (!config.prompts) {
          console.log("No prompts found in config");
          process.exit(0);
        }

        const selection = await clack.select({
          message: "Select a template for content generation:",
          options: Object.entries(config.prompts).map(([key, val]) => ({
            value: Object.entries(val as any).reduce((acc, curr) => {
              const newAcc = {
                ...acc,
                [curr[0]]: fs.readFileSync(`${curr[1] as string}.md`, "utf8"),
              };

              return newAcc;
            }, {}),
            label: key,
          })),
        });

        return selection;
      },

      /**
       * Generate completion
       */
      generate: async ({ results: { branchSelect, selectTemplate } }) => {
        const spinner = clack.spinner();
        spinner.start("Generating content...");
        const { instructions, mock_output, mock_diff, mock_commits } =
          selectTemplate as any;

        try {
          const api = await getApi();
          const { repository, organization } = getGithubOrgandRepo();

          const res = await api.ai.generateFromDiff.query({
            owner: organization,
            repo: repository,
            baseSha: getDefaultBranch(),
            headSha: branchSelect as string,
            prompt: {
              instructions,
              mock_output,
              mock_diff,
              mock_commits,
            },
          });

          spinner.stop("✔ Successfully generated content.");
          return res;
        } catch (e: any) {
          spinner.stop(`✖ Failed to generate content: ${e.message}`);
          process.exit(0);
        }
      },

      /**
       * Show results and pick a file to save
       */
      pick: async ({ results: { generate } }) => {
        console.log("Output: \n\n");
        console.log(chalk.dim((generate as any).choices[0].message.content));
        console.log("\n\n");

        const confirm = await clack.confirm({
          message: "Would you like to accept this change?",
        });

        return confirm;
      },

      /**
       * Let user select where they want to save the output
       */
      selectDirectory: async () => {
        const root = ".";

        const recursiveSelectDirectory = async (
          path: string
        ): Promise<string> => {
          const directories = fs
            .readdirSync(path, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

          const options = [
            {
              value: "--choose--",
              label: chalk.green("Choose as directory"),
            },
            ...(path !== root
              ? [
                  {
                    value: "..",
                    label: "..",
                  },
                ]
              : []),
            ...directories.map((dir) => ({
              value: dir,
              label: dir,
            })),
          ];

          const selection = await clack.select({
            message: "Select a directory to save output:",
            options,
          });

          if (selection === "..") {
            process.stdout.write("\x1Bc");

            return recursiveSelectDirectory(
              path.split("/").slice(0, -1).join("/")
            );
          }

          if (selection === "--choose--") {
            return path;
          }

          /**
           * Clear the terminal (but history is not deleted)
           * It would be better if this wasn't necessary, Clack may eventually build this in:
           * https://github.com/natemoo-re/clack/issues/96
           */
          process.stdout.write("\x1Bc");

          return recursiveSelectDirectory(`${path}/${selection}`);
        };

        return recursiveSelectDirectory(root);
      },

      /**
       * Save file
       */
      save: async ({ results: { selectDirectory, generate } }) => {
        const fileName = await clack.text({
          message: "Enter a file name:",
          placeholder: "generated.md",
        });

        try {
          fs.writeFileSync(
            `${selectDirectory}/${fileName as string}`,
            (generate as any).choices[0].message.content
          );

          const sections = generateSideNav(
            // Remove './' from the beginning of the path
            [`${selectDirectory}/${fileName as string}`.slice(2)],
            config["sections"]
          );

          /**
           * Update config
           */
          fs.writeFileSync(
            resolve(".floe/config.json"),
            JSON.stringify({ ...config, sections }, null, 2)
          );

          /**
           * SUCCESS
           */
          clack.outro(chalk.green("Your file was saved and config updated"));
        } catch (e: any) {
          console.log(e);
          process.exit(0);
        }
      },
    },
    {
      onCancel: () => {
        clack.cancel("Operation cancelled");
        return process.exit(0);
      },
    }
  );
}
