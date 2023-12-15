import { z } from "zod";
import type { ListIssueCommentsResponse } from "@floe/types";
import type {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "~/types/private-middleware";
import { HttpError } from "@floe/lib/http-error";
import { getOctokit } from "~/lib/github/octokit";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  issueNumber: z.number(),
});

async function handler({ queryObj, workspace }: NextApiRequestExtension) {
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

  // octokit.paginate(octokit.rest.issues.listComments, {
  //   owner,
  //   repo,
  //   issue_number: issueNumber,
  // });
}
