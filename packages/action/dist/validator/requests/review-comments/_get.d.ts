import { z } from "zod";
import type { Endpoints } from "@octokit/types";
export declare const querySchema: z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
    pullNumber: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    owner: string;
    repo: string;
    pullNumber: number;
}, {
    owner: string;
    repo: string;
    pullNumber: number;
}>;
export type GetReviewCommentsResponse = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];
export type GetReviewCommentsInput = z.infer<typeof querySchema>;
//# sourceMappingURL=_get.d.ts.map