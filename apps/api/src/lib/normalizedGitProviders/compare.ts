import { HttpError } from "@floe/lib/http-error";
import type { Workspace } from "~/types/middleware";
import type { CompareInfo } from "~/types/compare";
import { getGitHubGitDiff } from "../github/compare";
import { getOctokit } from "../github/octokit";
import { getGitHubPull } from "../github/pull";

/**
 * Fetch commits, diffs, etc for GitHub or GitLab
 */
export async function compare(
  parsed: {
    owner: string;
    repo: string;
    pullNumber: number;
  },
  workspace: Workspace
) {
  let compareInfo: CompareInfo | null = null;

  /**
   * Can only have githubIntegration or gitlabIntegration, not both
   */
  if (workspace.githubIntegration) {
    if (!workspace.githubIntegration.installationId) {
      throw new HttpError({
        statusCode: 400,
        message: "The GitHub integration is pending approval",
      });
    }

    const octokit = await getOctokit(
      workspace.githubIntegration.installationId
    );

    const pull = await getGitHubPull(
      parsed.owner,
      parsed.repo,
      parsed.pullNumber,
      octokit
    );

    const diffResult = await getGitHubGitDiff(
      parsed.owner,
      parsed.repo,
      pull?.base.sha ?? "",
      pull?.head.sha ?? "",
      octokit
    );

    if (!diffResult) {
      return;
    }

    compareInfo = {
      commits: diffResult.commits,
      diffs: diffResult.diffs,
    };
  } else if (workspace.gitlabIntegration) {
    throw new HttpError({
      statusCode: 400,
      message: "Floe does not support GitLab yet",
    });
    // const token = decryptData(workspace.gitlabIntegration.encryptedAccessToken);
    // const response = await getGitLabGitDiff(
    //   parsed.owner,
    //   parsed.repo,
    //   parsed.baseSha,
    //   parsed.headSha,
    //   token
    // );
    // if (!response) {
    //   return;
    // }
    // compareInfo = {
    //   commits: response.commits,
    //   diffs: response.diffs,
    // };
  } else {
    throw new HttpError({
      statusCode: 400,
      message: "Workspace does not have a GitHub or GitLab integration",
    });
  }

  return compareInfo;
}
