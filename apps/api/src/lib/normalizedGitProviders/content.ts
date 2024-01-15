import type { Workspace, NextApiResponseExtension } from "~/types/middleware";
import { getOctokit } from "../github/octokit";
import { getGitHubContents } from "../github/contents";

/**
 * Fetch commits, diffs, etc for GitHub or GitLab
 */
export async function contents(
  contentsUrl: string,
  workspace: Workspace,
  res: NextApiResponseExtension
) {
  /**
   * Can only have githubIntegration or gitlabIntegration, not both
   */
  if (workspace.githubIntegration) {
    if (!workspace.githubIntegration.installationId) {
      res.status(400).json({
        error: "The GitHub integration is pending approval",
      });

      return;
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
    res.status(400).json({
      error: "Workspace does not have a GitHub or GitLab integration",
    });
  }
}
