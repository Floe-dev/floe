import { Command } from "commander";
import fs from "fs";
import { glob } from "glob";
import { sleep } from "../utils/sleep.js";
import { resolve } from "path";
import { getApi } from "../utils/api.js";
import { capitalize } from "../utils/capitalize.js";
import { defaultConfig } from "@floe/config";
import { slugify } from "@floe/utils";
import { getGithubOrgandRepo, getDefaultBranch } from "../utils/git";
const chalkImport = import("chalk").then((m) => m.default);
const clackImport = import("@clack/prompts");

export function init(program: Command) {
  program
    .command("init")
    .option("-p, --project <project>", "project slug for datasource")
    .description("Setup a new Floe data source")
    .action(async (options) => {
      const chalk = await chalkImport;
      const clack = await clackImport;
      const api = await getApi();
      /**
       * Check if user is in a git repository
       */
      const gitDir = fs.existsSync(".git");
      if (!gitDir) {
        console.log(
          chalk.red(
            "No git repository was found. Make sure you are in the root of your Floe data source."
          )
        );
        return;
      }
      /**
       * Get the repository, organization, and default branch. These will be
       * used to create a data source. Best to retreive early to expose
       * potential errors before taking user time.
       */
      const { repository, organization } = getGithubOrgandRepo();
      const branch = getDefaultBranch();
      clack.intro("init");
      await clack.group(
        {
          /**
           * Check if directory already exists
           */
          ...(fs.existsSync(".floe") && {
            overwrite: async () => {
              const answer = await clack.confirm({
                message:
                  "A `.floe` directory was detected. The contents will be overwritten. Do you want to continue?",
              });
              if (answer === false) {
                clack.cancel("Operation cancelled");
                return process.exit(0);
              }
              return answer;
            },
          }),

          /**
           * Create a data source
           * Only use this option is a project slug is provided
           */
          ...(!!options.project && {
            createDataSource: async () => {
              const name = (await clack.text({
                message: "What do you want to call your datasource?",
                placeholder: "eg. Frontend",
                initialValue: "",
                validate(value) {
                  if (value.length < 3) return `Must be at least 3 characters!`;
                  if (value.length > 24)
                    return `Must be less than 24 characters!`;
                },
              })) as string;

              const spinner = clack.spinner();
              spinner.start("Creating data source...");

              const slug = slugify(name);

              try {
                await api.dataSource.create.mutate({
                  owner: organization,
                  repository,
                  baseBranch: branch,
                  name,
                  slug,
                  projectSlug: options.project,
                });
                spinner.stop("✔ Data source created!");
              } catch (e) {
                spinner.stop("✖ Data source could not be created.");
                const answer = await clack.confirm({
                  message:
                    "Would you like to proceed anyways? You can manually create a datasource in the Floe dashboard later.",
                });
                if (answer === false) {
                  clack.cancel("Operation cancelled");
                  return process.exit(0);
                }
              }
            },
          }),

          /**
           * Scaffold Selection
           */
          scaffoldSelect: async () =>
            (await clack.multiselect({
              message: "What do you want to use this project for?",
              options: [
                { value: "docs", label: "📖 Docs", hint: "recommended" },
                {
                  value: "changelogs",
                  label: "🚀 Changelogs",
                  hint: "recommended",
                },
              ],
              required: true,
            })) as string[],

          /**
           * Use existing files?
           */
          useExistingFiles: async () => {
            const answer = await clack.confirm({
              message:
                "Would you like Floe to index existing markdown files in this repository?",
            });
            return answer;
          },
          scaffold: async ({
            results: { scaffoldSelect, useExistingFiles },
          }) => {
            const spinner = clack.spinner();
            spinner.start("Generating project files...");

            try {
              /**
               * Scaffold images
               */
              fs.cpSync(__dirname + `/default-files/public`, ".floe/public", {
                recursive: true,
              });

              /**
               * Scaffold mock data
               */
              fs.cpSync(
                __dirname + `/default-files/prompts/mocks`,
                ".floe/prompts/mocks",
                { recursive: true }
              );

              /**
               * Scaffold templates
               */
              scaffoldSelect!.forEach((item) => {
                /**
                 * Copy page files
                 */
                fs.cpSync(__dirname + `/default-files/pages/${item}`, item, {
                  recursive: true,
                });

                /**
                 * Copy prompts
                 */
                fs.cpSync(
                  __dirname + `/default-files/prompts/${item}`,
                  `.floe/prompts/${item}`,
                  { recursive: true }
                );
              });

              /**
               * Create config file
               */
              const newFilesPattern = scaffoldSelect!.map(
                (item) => `${item}/**/*.md`
              );
              // TODO: Might need to add to this in the future
              const ignorePatterns = ["node_modules/**", ".floe/prompts/**"];
              const existingMDFiles = await glob(["*.md", "**/*.md"], {
                ignore: [...ignorePatterns, ...newFilesPattern],
              });
              const newMDFiles = await glob(newFilesPattern);
              const allFiles = [
                ...(useExistingFiles ? existingMDFiles : []),
                ...newMDFiles,
              ];
              /**
               * Recursively creates sections in this format [
               */
              const sections = allFiles.reduce((acc, file) => {
                const parts = file.split("/");
                // @ts-ignore
                const createPages = (
                  pages: any[],
                  parts: string[],
                  depth = 0
                ) => {
                  const [first, ...rest] = parts;
                  const title = capitalize(first.replace(".md", ""));
                  /**
                   * If page already exists, add to it
                   */
                  const existingPage = pages.find(
                    (page) => page.title === title && page.pages
                  );
                  if (existingPage) {
                    existingPage.pages.push(
                      createPages(existingPage.pages, rest, depth + 1)
                    );
                    return pages;
                  }
                  // @ts-ignore
                  const page =
                    /**
                     * If page is a leaf node, return a pageView. If not, return a page with pages
                     */
                    rest.length === 0
                      ? {
                          title,
                          pageView: {
                            path: file.replace(".md", ""),
                          },
                        }
                      : {
                          title,
                          pages: [createPages([], rest, depth + 1)],
                        };
                  /**
                   * If we are at the root, return the pages array
                   */
                  if (depth === 0) {
                    return [...pages, page];
                  }
                  return page;
                };
                return createPages(acc, parts);
              }, []);
              const prompts = scaffoldSelect?.reduce((acc, curr) => {
                return {
                  ...acc,
                  [curr]: {
                    instructions: `.floe/prompts/${curr}/instructions`,
                    mock_output: `.floe/prompts/${curr}/mock_output`,
                    mock_diff: ".floe/prompts/mocks/diff",
                    mock_commits: ".floe/prompts/mocks/commits",
                  },
                };
              }, {});
              const config = {
                ...defaultConfig,
                prompts,
                sections,
              };
              fs.writeFileSync(
                resolve(".floe/config.json"),
                JSON.stringify(config, null, 2)
              );

              await sleep(1000);
              spinner.stop("✔ Templates created!");
            } catch (e: any) {
              // spinner.stop();
              program.error("Ruh roh! There was an error: " + e.message);
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

      /**
       * SUCCESS
       */
      clack.outro(
        chalk.green(
          "🎉 You're all set! You can now push your changes to GitHub to see them live."
        )
      );
    });
}
