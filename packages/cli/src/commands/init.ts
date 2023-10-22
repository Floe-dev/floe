import { Command } from "commander";
import fs from "fs";
import Jimp from "jimp";
import { glob } from "glob";
import { sleep } from "../utils/sleep.js";
import { blogSample } from "../default-files/sample-blog.js";
import { changelogSample } from "../default-files/sample-changelog.js";
import { docSample } from "../default-files/sample-doc.js";
import { docSample2 } from "../default-files/sample-doc2.js";
import { postSample } from "../default-files/sample-post.js";
import { resolve } from "path";
import { capitalize } from "../utils/capitalize.js";
import { defaultConfig } from "@floe/config";
import { execSync } from "child_process";
const chalkImport = import("chalk").then((m) => m.default);
const clackImport = import("@clack/prompts");

const getGithubOrgandRepo = () => {
  const gitRepoPath = "."; // Path to Git repository

  try {
    const val = execSync(`git -C ${gitRepoPath} remote -v`).toString();
    const remoteInfo = val.trim().split("\n");

    // Check if any remote URL points to GitHub
    const githubRemote = remoteInfo.find((remote) =>
      /github\.com/.test(remote)
    );

    if (!githubRemote) {
      console.log(
        "Must be a GitHub repository. Please create a GitHub repository and try again."
      );
      process.exit(1);
    }

    const match = githubRemote.match(/github\.com[\/:]([^/]+)\/([^/]+)\.git/);

    if (match) {
      const organization = match[1];
      const repository = match[2];

      return {
        organization,
        repository,
      };
    } else {
      console.log(
        "Could not find GitHub Organization and Repository. Please create a GitHub repository and try again."
      );
      process.exit(1);
    }
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
};

const getDefaultBranch = () => {
  try {
    const val = execSync(
      `git remote show origin | sed -n '/HEAD branch/s/.*: //p'`
    ).toString();

    return val;
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
};

const templateSamples = {
  blog: blogSample,
  changelog: changelogSample,
  docs: docSample,
  faq: postSample,
  wiki: postSample,
};

export function init(program: Command) {
  program
    .command("init")
    .description("Setup a new Floe data source")
    .action(async () => {
      const chalk = await chalkImport;
      const clack = await clackImport;
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

      const { repository, organization } = getGithubOrgandRepo();
      const branch = getDefaultBranch();

      console.log(11111, repository, organization, branch);

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
           * Scaffold Selection
           */
          scaffoldSelect: async () =>
            (await clack.multiselect({
              message: "What do you want to use this project for?",
              options: [
                { value: "docs", label: "📖 Docs", hint: "recommended" },
                {
                  value: "changelog",
                  label: "🚀 Changelog",
                  hint: "recommended",
                },
              ],
              required: true,
            })) as (keyof typeof templateSamples)[],

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
            spinner.start("Generating sample images...");
            await sleep(1000);

            try {
              /**
               * Scaffold images
               */
              fs.mkdirSync(".floe/public", { recursive: true });

              const randomImageUrl = "https://picsum.photos/500/300.jpg";
              const image1 = await Jimp.read(randomImageUrl);

              image1.write(resolve(".floe/public/image1.jpg"));

              const randomImageUrl2 = "https://picsum.photos/500/300.jpg";
              const image2 = await Jimp.read(randomImageUrl2);
              image2.write(resolve(".floe/public/image2.jpg"));

              spinner.message("Generating files...");

              /**
               * Scaffold templates
               */
              scaffoldSelect!.forEach((item) => {
                const file = templateSamples[item];

                if (item === "docs") {
                  fs.mkdirSync("docs", { recursive: true });
                  fs.writeFileSync(resolve("docs/index.md"), docSample);
                  fs.writeFileSync(
                    resolve("docs/getting-started.md"),
                    docSample2
                  );
                  return;
                }

                fs.mkdirSync(item, { recursive: true });
                fs.writeFileSync(resolve(`${item}/sample.md`), file);
              });

              /**
               * Create config file
               */
              const newFilesPattern = scaffoldSelect!.map(
                (item) => `${item}/**/*.md`
              );
              // TODO: Might need to add to this in the future
              const ignorePatterns = ["node_modules/**"];
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

              const config = {
                ...defaultConfig,
                sections,
              };

              fs.writeFileSync(
                resolve(".floe/config.json"),
                JSON.stringify(config, null, 2)
              );

              await sleep(1500);

              const randomMessages = [
                "Bumbling beebles...",
                "Golfing gophers...",
                "Shining shoes...",
                "Dueling ducks...",
                "Picking pumpkins...",
                "Branding bananas...",
                "Slicing salamis...",
                "Janking jellies...",
              ];

              spinner.message(
                randomMessages[
                  Math.floor(Math.random() * randomMessages.length)
                ]
              );

              await sleep(1500);

              spinner.stop("✔ Templates created!");
            } catch (e: any) {
              spinner.stop();
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
