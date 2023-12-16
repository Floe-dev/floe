import { z } from "zod";
import type { Endpoints } from "@octokit/types";

export const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  pullNumber: z.coerce.number(),
});

export type GetReviewCommentsResponse =
  Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];

export type GetReviewCommentsInput = z.infer<typeof querySchema>;
