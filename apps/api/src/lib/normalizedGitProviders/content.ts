import { HttpError } from "@floe/lib/http-error";
import type { Workspace } from "~/types/middleware";
import { getOctokit } from "../github/octokit";
import { getGitHubContents } from "../github/contents";

/**
 * Fetch commits, diffs, etc for GitHub or GitLab
 */
export async function contents(contentsUrl: string, workspace: Workspace) {
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

    const githubContents = await getGitHubContents(contentsUrl, octokit);

    return githubContents;
  } else if (workspace.gitlabIntegration) {
    // TODO: implement
    // const token = decryptData(workspace.gitlabIntegration.encryptedAccessToken);
  } else {
    throw new HttpError({
      statusCode: 400,
      message: "Workspace does not have a GitHub or GitLab integration",
    });
  }
}
