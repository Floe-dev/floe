import { z } from "zod";
import type { Endpoints } from "@octokit/types";
import { api } from "../api";

export const querySchema = z.object({
  body: z.string(),
  repo: z.string(),
  owner: z.string(),
  commentId: z.coerce.number(),
});

export type PatchReviewCommentsResponse =
  Endpoints["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]["response"]["data"];

export type PatchReviewCommentsInput = z.infer<typeof querySchema>;

export async function updateReviewComment({
  body,
  repo,
  owner,
  commentId,
}: PatchReviewCommentsInput) {
  return api.get<PatchReviewCommentsResponse>("/api/v1/review-comments", {
    params: {
      body,
      repo,
      owner,
      commentId,
    },
  });
}
