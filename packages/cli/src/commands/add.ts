import { Command } from "commander";
import { getApi } from "../utils/api.js";
import { execSync } from "child_process";
import simpleGit, { CleanOptions } from "simple-git";
import {
  currentBranch,
  getDefaultBranch,
  getGithubOrgandRepo,
} from "../utils/git";
const clackImport = import("@clack/prompts");

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

        /**
         * Generate completion
         */
        generate: async ({ results: { branchSelect } }) => {
          const spinner = clack.spinner();
          spinner.start("Generating content...");

          try {
            const api = await getApi();
            const git = simpleGit();

            const example = `
                We are excited to announce the release of our new product. It's been a long time coming, but we're finally ready to share it with you!
              `;

            const { repository, organization } = getGithubOrgandRepo();
            const baseSha = await git.revparse([branchSelect as string]);
            const headSha = await git.revparse([getDefaultBranch()]);

            const res = await api.userContent.generate.query({
              owner: organization,
              repo: repository,
              baseSha,
              headSha,
              example,
            });

            spinner.stop("✔ Successfully generated content.");

            return res;
          } catch (e: any) {
            spinner.stop("✖ Failed to generate content.");
            process.exit(0);
          }
        },
      });
    });
}
