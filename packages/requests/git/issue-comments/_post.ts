import { z } from "zod";
import type { Endpoints } from "@octokit/types";
import { api } from "../../api";

export const querySchema = z.object({
  repo: z.string(),
  body: z.string(),
  owner: z.string(),
  issueNumber: z.coerce.number(),
});

export type PostGitIssueCommentsResponse =
  Endpoints["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]["data"];

export type PostIssueCommentsInput = z.infer<typeof querySchema>;

export async function createGitIssueComment({
  repo,
  owner,
  body,
  issueNumber,
}: PostIssueCommentsInput) {
  return api.post<PostGitIssueCommentsResponse>("/api/v1/git/issue-comments", {
    params: {
      repo,
      owner,
      body,
      issueNumber,
    },
  });
}
