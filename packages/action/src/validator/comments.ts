import { api } from "@floe/lib/axios";
import type { GetReviewCommentsResponse } from "@floe/types";

export async function fetchComments({
  owner,
  repo,
  pullNumber,
}: {
  owner: string;
  repo: string;
  pullNumber: number;
}) {
  return api.get<GetReviewCommentsResponse>("/api/v1/review-comments", {
    params: {
      owner,
      repo,
      pullNumber,
    },
  });
}
