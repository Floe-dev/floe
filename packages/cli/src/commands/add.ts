import fs from "fs";
import { Command } from "commander";
import { getApi } from "../utils/api.js";
import { execSync } from "child_process";
import { getDefaultBranch, getGithubOrgandRepo } from "../utils/git";
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

export function add(program: Command) {
  program
    .command("add")
    .description("Add")
    .action(async () => {
      const clack = await clackImport;
      const chalk = await chalkImport;

      await clack.group({
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
          const data = fs.readFileSync(".floe/config.json", "utf8");
          const config = JSON.parse(data);

          if (!config.prompts) {
            console.log("No prompts found in config");
            process.exit(0);
          }

          const selection = await clack.select({
            message: "Select a template for content generation:",
            options: Object.entries(config.prompts).map(([key, val]) => ({
              value: val,
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

          try {
            const api = await getApi();
            const { repository, organization } = getGithubOrgandRepo();

            const res = await api.userContent.generate.query({
              owner: organization,
              repo: repository,
              baseSha: getDefaultBranch(),
              headSha: branchSelect as string,
              messages: selectTemplate as any,
            });

            spinner.stop("✔ Successfully generated content.");

            console.log(111111, res.choices);
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
      });
    });
}
