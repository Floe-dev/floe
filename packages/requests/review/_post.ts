import { z } from "zod";
import { api } from "../api";

const querySchema = z.object({
  path: z.string(),
  content: z.string(),
  startLine: z.coerce.number().optional().default(1),
  rule: z.object({
    code: z.string(),
    level: z.union([z.literal("error"), z.literal("warn")]),
    description: z.string(),
  }),
});

export type PostReviewResponse =
  | {
      files: {
        violations: {
          level: "error" | "warn" | undefined;
          description: string | undefined;
          code: string;
          errorDescription: string;
          fix: string | undefined;
          startLine: number;
          endLine: number;
          lineContent: string;
        }[];
        filename: string;
      }[];
      cached: boolean;
    }
  | undefined;
export type PostReviewInput = z.infer<typeof querySchema>;

export async function createReview({
  path,
  content,
  startLine,
  rule,
}: PostReviewInput) {
  return api.post<PostReviewResponse>("/api/v1/review", {
    params: {
      path,
      content,
      startLine,
      rule,
    },
  });
}
