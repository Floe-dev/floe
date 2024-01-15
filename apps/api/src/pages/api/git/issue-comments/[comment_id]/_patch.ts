import { HttpError } from "@floe/lib/http-error";
import {
  querySchema,
  type PatchGitIssueCommentsResponse,
} from "@floe/requests/git/issue-comments/[comment_id]/_patch";
import type { NextApiRequestExtension } from "~/types/middleware";
import { getOctokit } from "~/lib/github/octokit";
import { defaultResponder } from "~/lib/middleware/default-responder";
import { zParse } from "~/utils/z-parse";

async function handler({
  query,
  body,
  workspace,
}: NextApiRequestExtension): Promise<PatchGitIssueCommentsResponse> {
  const parsed = zParse(querySchema, {
    body: body.body,
    repo: body.repo,
    owner: body.owner,
    commentId: query.comment_id,
  });

  if (workspace.gitlabIntegration) {
    throw new HttpError({
      message: "GitLab is not yet supported for this endpoint.",
      statusCode: 400,
    });
  }

  if (!workspace.githubIntegration) {
    throw new HttpError({
      message: "You must first setup your GitHub integration.",
      statusCode: 400,
    });
  }

  const octokit = await getOctokit(workspace.githubIntegration.installationId);

  const comments = await octokit.rest.issues
    .updateComment({
      body: parsed.body,
      repo: parsed.repo,
      owner: parsed.owner,
      comment_id: parsed.commentId,
    })
    .catch(() => {
      throw new HttpError({
        message: "Could not update comment on GitHub.",
        statusCode: 500,
      });
    });

  return comments.data;
}

export default defaultResponder(handler);
