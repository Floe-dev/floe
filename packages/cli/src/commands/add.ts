import { Command } from "commander";
import { getApi } from "../utils/api.js";
import { execSync } from "child_process";
import { getDefaultBranch } from "../utils/git";

function gitDiffIgnoreFiles(
  gitRepoPath: string,
  ignoredFiles: string[],
  branchName: string
) {
  // Create a list of "!path/to/ignored-file" for each file to ignore
  const ignoreOptions = ignoredFiles.map((file) => `':!${file}'`).join(" ");

  const gitDiffCommand = `git -C ${gitRepoPath} diff ${getDefaultBranch()}...HEAD -- . ${ignoreOptions}`;

  return execSync(gitDiffCommand, {
    encoding: "utf-8",
  });
}

function listCommitMessagesForBranch(gitRepoPath: string, branchName: string) {
  try {
    const gitLogCommand = `git -C ${gitRepoPath} log --oneline --abbrev=8 ${branchName}`;

    const commitLog = execSync(gitLogCommand, { encoding: "utf-8" });
    const commitMessages = commitLog.trim().split("\n");

    return commitMessages;
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
      /**
       * TODO: Add other generated files here
       */
      const ignoredFiles = [
        "package-lock.json",
        "pnmp-lock.json",
        "pnpm-lock.yaml",
      ];
      const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf-8",
      }).trim();
      const diff = gitDiffIgnoreFiles(
        process.cwd(),
        ignoredFiles,
        currentBranch
      );
      const commits = listCommitMessagesForBranch(process.cwd(), currentBranch);

      const api = await getApi();

      const diffInput = `
        Commits:
        ${commits.join("\n")}
        Diff:
        ${diff}
      `;

      const template = `
        We are excited to announce the release of our new product. It's been a long time coming, but we're finally ready to share it with you!
      `;

      const res = await api.userContent.generate.query({
        diff: diffInput,
        template,
      });
      console.log(2222, res);
    });
}
