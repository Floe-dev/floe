import { z } from "zod";
import type { Endpoints } from "@octokit/types";
export declare const querySchema: z.ZodObject<
  {
    path: z.ZodString;
    repo: z.ZodString;
    body: z.ZodString;
    owner: z.ZodString;
    commitId: z.ZodString;
    pullNumber: z.ZodNumber;
    line: z.ZodOptional<z.ZodNumber>;
    startLine: z.ZodOptional<z.ZodNumber>;
    side: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT"]>>;
    startSide: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT"]>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    owner: string;
    repo: string;
    pullNumber: number;
    body: string;
    path: string;
    commitId: string;
    line?: number | undefined;
    startLine?: number | undefined;
    side?: "LEFT" | "RIGHT" | undefined;
    startSide?: "LEFT" | "RIGHT" | undefined;
  },
  {
    owner: string;
    repo: string;
    pullNumber: number;
    body: string;
    path: string;
    commitId: string;
    line?: number | undefined;
    startLine?: number | undefined;
    side?: "LEFT" | "RIGHT" | undefined;
    startSide?: "LEFT" | "RIGHT" | undefined;
  }
>;
export type PostGitReviewCommentsResponse =
  Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];
//# sourceMappingURL=_post.d.ts.map
