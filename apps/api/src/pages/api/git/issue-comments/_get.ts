import { HttpError } from "@floe/lib/http-error";
import { querySchema } from "@floe/requests/git/review-comments/_get";
import type { GetGitReviewCommentsResponse } from "@floe/requests/git/review-comments/_get";
import type { NextApiRequestExtension } from "~/types/private-middleware";
import { getOctokit } from "~/lib/github/octokit";
import { defaultResponder } from "~/lib/helpers/default-responder";
import { zParse } from "~/utils/z-parse";

async function handler({
  queryObj,
  workspace,
}: NextApiRequestExtension): Promise<GetGitReviewCommentsResponse> {
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

  const comments = await octokit
    .paginate(octokit.rest.pulls.listReviewComments, {
      owner: parsed.owner,
      repo: parsed.repo,
      pull_number: parsed.pullNumber,
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
