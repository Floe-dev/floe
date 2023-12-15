import { z } from "zod";
import { HttpError } from "@floe/lib/http-error";
import type { PostIssueCommentsResponse } from "@floe/types";
import type { NextApiRequestExtension } from "~/types/private-middleware";
import { getOctokit } from "~/lib/github/octokit";
import { defaultResponder } from "~/lib/helpers/default-responder";
import { zParse } from "~/utils/z-parse";

const querySchema = z.object({
  repo: z.string(),
  body: z.string(),
  owner: z.string(),
  issueNumber: z.coerce.number(),
  line: z.coerce.number().optional(),
  startLine: z.coerce.number().optional(),
  side: z.enum(["LEFT", "RIGHT"]).optional(),
  startSide: z.enum(["LEFT", "RIGHT"]).optional(),
});

async function handler({
  queryObj,
  workspace,
}: NextApiRequestExtension): Promise<PostIssueCommentsResponse> {
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

  const comments = await octokit.rest.issues
    .createComment({
      body: parsed.body,
      repo: parsed.repo,
      owner: parsed.owner,
      issue_number: parsed.issueNumber,
      line: parsed.line,
      start_line: parsed.startLine,
      side: parsed.side,
      start_side: parsed.startSide,
    })
    .catch(() => {
      throw new HttpError({
        message: "Could not create comment on GitHub.",
        statusCode: 500,
      });
    });

  return comments.data;
}

export default defaultResponder(handler);
