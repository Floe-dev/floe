import { HttpError } from "@floe/lib/http-error";
import {
  querySchema,
  type GetGitIssueCommentsResponse,
} from "@floe/requests/git/issue-comments/_get";
import type { NextApiRequestExtension } from "~/types/middleware";
import { getOctokit } from "~/lib/github/octokit";
import { defaultResponder } from "~/lib/middleware/default-responder";
import { zParse } from "~/utils/z-parse";

async function handler({
  queryObj,
  workspace,
}: NextApiRequestExtension): Promise<GetGitIssueCommentsResponse> {
  const parsed = zParse(querySchema, queryObj);

  if (workspace.gitlabIntegration) {
    throw new HttpError({
      message: "GitLab is not yet supported for this endpoint.",
      statusCode: 400,
    });
  }

  if (!workspace.githubIntegration?.installationId) {
    throw new HttpError({
      message: "You must first setup your GitHub integration.",
      statusCode: 400,
    });
  }

  const octokit = await getOctokit(workspace.githubIntegration.installationId);

  const comments = await octokit
    .paginate(octokit.rest.issues.listComments, {
      owner: parsed.owner,
      repo: parsed.repo,
      issue_number: parsed.issueNumber,
    })
    .catch(() => {
      throw new HttpError({
        message: "Could not fetch comments from GitHub.",
        statusCode: 500,
      });
    });

  return comments;
}

export default defaultResponder(handler);
