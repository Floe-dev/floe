import { execSync } from "child_process";

export const getGithubOrgandRepo = () => {
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

export const getDefaultBranch = () => {
  try {
    const val = execSync(
      `git remote show origin | sed -n '/HEAD branch/s/.*: //p'`,
      {
        encoding: "utf-8",
      }
    ).trim();

    return val;
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
};

export const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
  encoding: "utf-8",
}).trim();
