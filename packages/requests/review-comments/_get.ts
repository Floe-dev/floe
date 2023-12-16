import { z } from "zod";
import { api } from "@floe/lib/axios";
import type { Endpoints } from "@octokit/types";

export const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  pullNumber: z.coerce.number(),
});

export type GetReviewCommentsResponse =
  Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];

export type GetReviewCommentsInput = z.infer<typeof querySchema>;

export async function fetchReviewComments({
  owner,
  repo,
  pullNumber,
}: GetReviewCommentsInput) {
  return api.get<GetReviewCommentsResponse>("/api/v1/review-comments", {
    params: {
      owner,
      repo,
      pullNumber,
    },
  });
}
