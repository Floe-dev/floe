import type { Octokit } from "@octokit/core";

export async function getGitHubPull(
  owner: string,
  repo: string,
  pullNumber: number,
  octokit: Octokit
) {
  try {
    const pull = await octokit.request(
      `GET /repos/{owner}/{repo}/pulls/{pull_number}`,
      {
        owner,
        repo,
        pull_number: pullNumber,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return pull.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
