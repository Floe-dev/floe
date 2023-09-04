import { Octokit } from "octokit";

export const getRepositoryContent = async (octokit: Octokit, {
  owner,
  repo,
  path,
  ref,
}: {
  owner: string;
  repo: string;
  path: string;
  ref: string;
}) => {
  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo,
      path,
      ref,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return Buffer.from(
    // @ts-ignore
    response.data.content,
    "base64"
  ).toString();
}
