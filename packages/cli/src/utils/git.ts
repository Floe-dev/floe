import { execSync } from "node:child_process";

export const gitGithubOrGitlabOrgAndRepo = () => {
  const githubOrgAndRepo = getOrgAndRepo("github");
  const gitlabOrgAndRepo = getOrgAndRepo("gitlab");

  return githubOrgAndRepo || gitlabOrgAndRepo;
};

export const getOrgAndRepo = (provider: "github" | "gitlab") => {
  const gitRepoPath = "."; // Path to Git repository

  try {
    const val = execSync(`git -C ${gitRepoPath} remote -v`).toString();
    const remoteInfo = val.trim().split("\n");

    // Check if any remote URL points to GitHub
    const remote = remoteInfo.find((r) => r.includes(`${provider}.com`));

    if (!remote) {
      return null;
    }

    const githubMatch = /github\.com[/:]([^/]+)\/([^/]+)\.git/.exec(remote);
    const gitlabMatch = /gitlab\.com[/:]([^/]+)\/([^/]+)\.git/.exec(remote);
    const match = provider === "github" ? githubMatch : gitlabMatch;

    if (match) {
      const owner = match[1];
      const repo = match[2];

      return {
        owner,
        repo,
      };
    }

    return null;
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

export const getCurrentBranch = () =>
  execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf-8",
  }).trim();

export const getDiff = (basehead: string) => {
  /**
   * TODO: May need special handling for CI env
   */

  return execSync(`git diff ${basehead}`, {
    encoding: "utf-8",
  }).trim();
};
