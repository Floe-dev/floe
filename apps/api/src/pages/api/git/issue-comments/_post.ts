import { HttpError } from "@floe/lib/http-error";
import {
  querySchema,
  type PostGitIssueCommentsResponse,
} from "@floe/requests/git/issue-comments/_post";
import type { NextApiRequestExtension } from "~/types/private-middleware";
import { getOctokit } from "~/lib/github/octokit";
import { defaultResponder } from "~/lib/helpers/default-responder";
import { zParse } from "~/utils/z-parse";

async function handler({
  body,
  workspace,
}: NextApiRequestExtension): Promise<PostGitIssueCommentsResponse> {
  const parsed = zParse(querySchema, body.params as Record<string, unknown>);

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
