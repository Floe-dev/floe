import { Octokit } from "@octokit/core";
import { minimatch } from "minimatch";

export const getFileTree = async (
  octokit: Octokit,
  {
    owner,
    repo,
    ref,
    rules,
  }: {
    owner: string;
    repo: string;
    ref: string;
    rules: string[];
  }
) => {
  const res = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner,
      repo,
      tree_sha: ref,
      recursive: "1",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const paths = res.data.tree.map((obj) => obj.path);

  return paths.filter((path) => {
    return (
      path &&
      rules.some((rule) => minimatch(path, rule)) &&
      !minimatch(path, ".floe/public/*")
    );
  }) as string[];
};
