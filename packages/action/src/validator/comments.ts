import { api } from "@floe/lib/axios";
import type {
  GetIssueCommentsResponse,
  PostIssueCommentsResponse,
} from "@floe/types";

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

export async function createComment({
  body,
  owner,
  repo,
  issueNumber,
  line,
  startLine,
  side,
  startSide,
}: {
  body: string;
  owner: string;
  repo: string;
  issueNumber: number;
  line?: number;
  startLine?: number;
  side?: "LEFT" | "RIGHT";
  startSide?: "LEFT" | "RIGHT";
}) {
  return api.post<PostIssueCommentsResponse>("/api/v1/issue-comments", {
    params: {
      owner,
      repo,
      issueNumber,
      body,
      line,
      startLine,
      side,
      startSide,
    },
  });
}
