import { HttpError } from "@floe/lib/http-error";
import { querySchema } from "@floe/requests/review-comments/_post";
import type { PostReviewCommentsResponse } from "@floe/requests/review-comments/_post";
import type { NextApiRequestExtension } from "~/types/private-middleware";
import { getOctokit } from "~/lib/github/octokit";
import { defaultResponder } from "~/lib/helpers/default-responder";
import { zParse } from "~/utils/z-parse";

async function handler({
  queryObj,
  workspace,
}: NextApiRequestExtension): Promise<PostReviewCommentsResponse> {
  const parsed = zParse(querySchema, queryObj);

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

  const comments = await octokit.rest.pulls
    .createReviewComment({
      body: parsed.body,
      repo: parsed.repo,
      owner: parsed.owner,
      pull_number: parsed.pullNumber,
      line: parsed.line,
      start_line: parsed.startLine,
      side: parsed.side,
      start_side: parsed.startSide,
      path: parsed.path,
      commit_id: parsed.commitId,
    })
    .catch((e) => {
      console.error(e.message);

      throw new HttpError({
        message: "Could not create comment on GitHub.",
        statusCode: 500,
      });
    });

  return comments.data;
}

export default defaultResponder(handler);
