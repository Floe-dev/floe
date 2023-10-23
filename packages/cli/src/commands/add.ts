import { Command } from "commander";
import { getApi } from "../utils/api.js";
import { execSync } from "child_process";

function gitDiffIgnoreFiles(gitRepoPath: string, ignoredFiles: string[]) {
  // Create a list of "!path/to/ignored-file" for each file to ignore
  const ignoreOptions = ignoredFiles.map((file) => `':!${file}'`).join(" ");

  const gitDiffCommand = `git -C ${gitRepoPath} diff -- . ${ignoreOptions}`;

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
      const diff = gitDiffIgnoreFiles(process.cwd(), ignoredFiles);
      const commits = listCommitMessagesForBranch(process.cwd(), "gh-app-cli");

      console.log(11111, commits);

      // const api = await getApi();

      // const template = `
      //   ---
      //   title: "My first changelog"
      //   date: 2023-08-31
      //   image: /image1.jpg
      //   ---
      //   We are excited to announce the release of our new product. It's been a long time coming, but we're finally ready to share it with you!
      // `;

      // const res = await api.userContent.generate.query({
      //   diff,
      //   template,
      // });
      // console.log(2222, res);
    });
}
