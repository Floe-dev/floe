import { z } from "zod";
import type { Endpoints } from "@octokit/types";
import { api } from "../../api";

export const querySchema = z.object({
  body: z.string(),
  repo: z.string(),
  owner: z.string(),
  commentId: z.coerce.number(),
});

export type PatchGitReviewCommentsResponse =
  Endpoints["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]["response"]["data"];

export type PatchReviewCommentsInput = z.infer<typeof querySchema>;

export async function updateGitReviewComment({
  body,
  repo,
  owner,
  commentId,
}: PatchReviewCommentsInput) {
  return api.get<PatchGitReviewCommentsResponse>(
    "/api/v1/git/review-comments",
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
