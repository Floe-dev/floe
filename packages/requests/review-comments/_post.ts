import { z } from "zod";
import type { Endpoints } from "@octokit/types";

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

export type PostReviewCommentsResponse =
  Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];
