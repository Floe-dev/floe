import type { Endpoints } from "@octokit/types";
export type GetGitReviewCommentsResponse =
  Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];
export type PostGitReviewCommentsResponse =
  Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];
export type PatchGitReviewCommentsResponse =
  Endpoints["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]["response"]["data"];
//# sourceMappingURL=review-comments.d.ts.map
