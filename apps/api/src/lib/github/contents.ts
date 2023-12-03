import type { Octokit } from "@octokit/core";
import type { Endpoints } from "@octokit/types";

export async function getGitHubContents(contentsUrl: string, octokit: Octokit) {
  const auth = (await octokit.auth()) as { token: string };

  const response = await fetch(contentsUrl, {
    headers: {
      Authorization: `token ${auth.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch GitHub contents");
  }

  const jsonResponse =
    (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"];

  // @ts-expect-error -- No need for complicated unwrap
  return Buffer.from(jsonResponse.content as string, "base64").toString(
    "utf-8"
  );
}
