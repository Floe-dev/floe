import { z } from "zod";
import type { Endpoints } from "@octokit/types";
import { api } from "../../api";

export const querySchema = z.object({
  path: z.string(),
  repo: z.string(),
  body: z.string(),
  owner: z.string(),
  commitId: z.string(),
  pullNumber: z.coerce.number(),
  line: z.coerce.number().optional(),
  startLine: z.coerce.number().optional(),
  side: z.enum(["LEFT", "RIGHT"]).optional(),
  startSide: z.enum(["LEFT", "RIGHT"]).optional(),
});

export type PostGitReviewCommentsResponse =
  Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];

export type PostReviewCommentsInput = z.infer<typeof querySchema>;

export async function createGitReviewComment({
  path,
  repo,
  owner,
  body,
  commitId,
  pullNumber,
  line,
  startLine,
  side,
  startSide,
}: PostReviewCommentsInput) {
  return api.post<PostGitReviewCommentsResponse>(
    "/api/v1/git/review-comments",
    {
      path,
      repo,
      owner,
      body,
      commitId,
      pullNumber,
      line,
      startLine,
      side,
      startSide,
    }
  );
}
