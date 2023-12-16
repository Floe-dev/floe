import { api } from "@floe/lib/axios";
import type {
  GetReviewCommentsResponse,
  PostReviewCommentsResponse,
} from "@floe/types";

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

export async function createComment({
  body,
  owner,
  repo,
  pullNumber,
  line,
  startLine,
  side,
  startSide,
}: {
  body: string;
  owner: string;
  repo: string;
  pullNumber: number;
  line?: number;
  startLine?: number;
  side?: "LEFT" | "RIGHT";
  startSide?: "LEFT" | "RIGHT";
}) {
  return api.post<PostReviewCommentsResponse>("/api/v1/review-comments", {
    params: {
      owner,
      repo,
      pullNumber,
      body,
      line,
      startLine,
      side,
      startSide,
    },
  });
}
