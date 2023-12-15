import type { Endpoints } from "@octokit/types";
export type GetIssueCommentsResponse = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]["data"];
export type PostIssueCommentsResponse = Endpoints["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]["data"];
export type PatchIssueCommentsResponse = Endpoints["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"]["response"]["data"];
//# sourceMappingURL=issue-comments.d.ts.map