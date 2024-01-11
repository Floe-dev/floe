import { z } from "zod";
import type { Endpoints } from "@octokit/types";
import { api } from "../../../api";

export const querySchema = z.object({
  body: z.string(),
  repo: z.string(),
  owner: z.string(),
  commentId: z.coerce.number(),
});

export type PatchGitIssueCommentsResponse =
  Endpoints["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"]["response"]["data"];

export type PatchIssueCommentsInput = z.infer<typeof querySchema>;

export async function updateGitIssueComment({
  body,
  repo,
  owner,
  commentId,
}: PatchIssueCommentsInput) {
  return api.patch<PatchGitIssueCommentsResponse>(
    "/api/v1/git/issue-comments",
    {
      params: {
        body,
        repo,
        owner,
        commentId,
      },
    }
  );
}
