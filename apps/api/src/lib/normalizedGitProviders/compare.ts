import { decryptData } from "@floe/lib/encryption";
import type {
  NextApiResponseExtension,
  Workspace,
} from "~/types/private-middleware";
import type { CompareInfo } from "~/types/compare";
import { getGitHubGitDiff } from "../github/compare";
import { getOctokit } from "../github/octokit";
import { getGitLabGitDiff } from "../gitlab/compare";

/**
 * Fetch commits, diffs, etc for GitHub or GitLab
 */
export async function compare(
  parsed: {
    owner: string;
    repo: string;
    baseSha: string;
    headSha: string;
  },
  workspace: Workspace,
  res: NextApiResponseExtension
) {
  let compareInfo: CompareInfo | null = null;

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

    const diffResult = await getGitHubGitDiff(
      parsed.owner,
      parsed.repo,
      parsed.baseSha,
      parsed.headSha,
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
    const token = decryptData(workspace.gitlabIntegration.encryptedAccessToken);

    const response = await getGitLabGitDiff(
      parsed.owner,
      parsed.repo,
      parsed.baseSha,
      parsed.headSha,
      token
    );

    if (!response) {
      return;
    }

    compareInfo = {
      commits: response.commits,
      diffs: response.diffs,
    };
  } else {
    res.status(400).json({
      error: "Workspace does not have a GitHub or GitLab integration",
    });
  }

  return compareInfo;
}
