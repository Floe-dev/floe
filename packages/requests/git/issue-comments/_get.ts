import { z } from "zod";
import type { Endpoints } from "@octokit/types";
import { api } from "../../api";

export const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  issueNumber: z.coerce.number(),
});

export type GetGitIssueCommentsResponse =
  Endpoints["GET /repos/{owner}/{repo}/issues/comments"]["response"]["data"];

export type GetIssueCommentsInput = z.infer<typeof querySchema>;

export async function fetchGitIssueComments({
  owner,
  repo,
  issueNumber,
}: GetIssueCommentsInput) {
  return api.get<GetGitIssueCommentsResponse>("/api/v1/git/issue-comments", {
    params: {
      owner,
      repo,
      issueNumber,
    },
  });
}
