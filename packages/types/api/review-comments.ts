import type { Endpoints } from "@octokit/types";

export type GetReviewCommentsResponse =
  Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];

export type PostReviewCommentsResponse =
  Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];

export type PatchReviewCommentsResponse =
  Endpoints["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]["response"]["data"];
