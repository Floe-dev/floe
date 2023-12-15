import { api } from "@floe/lib/axios";
import type { GetIssueCommentsResponse } from "@floe/types";

export async function fetchComments({
  owner,
  repo,
  issueNumber,
}: {
  owner: string;
  repo: string;
  issueNumber: number;
}) {
  return api.get<GetIssueCommentsResponse>("/api/v1/issue-comments", {
    params: {
      owner,
      repo,
      issueNumber,
    },
  });
}
