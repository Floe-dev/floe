import { z } from "zod";
import type { Endpoints } from "@octokit/types";
import { api } from "../../api";

export const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  pullNumber: z.coerce.number(),
});

export type GetGitReviewCommentsResponse =
  Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];

export type GetReviewCommentsInput = z.infer<typeof querySchema>;

export async function fetchGitReviewComments({
  owner,
  repo,
  pullNumber,
}: GetReviewCommentsInput) {
  return api.get<GetGitReviewCommentsResponse>("/api/v1/git/review-comments", {
    params: {
      owner,
      repo,
      pullNumber,
    },
  });
}
