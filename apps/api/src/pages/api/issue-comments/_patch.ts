import { z } from "zod";
import { HttpError } from "@floe/lib/http-error";
import type { PatchIssueCommentsResponse } from "@floe/types";
import type { NextApiRequestExtension } from "~/types/private-middleware";
import { getOctokit } from "~/lib/github/octokit";
import { defaultResponder } from "~/lib/helpers/default-responder";

const querySchema = z.object({
  body: z.string(),
  repo: z.string(),
  owner: z.string(),
  commentId: z.number(),
  issueNumber: z.number(),
});

async function handler({
  queryObj,
  workspace,
}: NextApiRequestExtension): Promise<PatchIssueCommentsResponse> {
  const parsed = querySchema.parse(queryObj);

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
      issue_number: parsed.issueNumber,
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
