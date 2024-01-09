import { z } from "zod";
import type OpenAI from "openai";
import { api } from "../api";

export const querySchema = z.object({
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
      violations: {
        description: string | undefined;
        suggestedFix: string | undefined;
        startLine: number;
        endLine: number;
        content: string;
      }[];
      rule: {
        level: "error" | "warn" | undefined;
        code: string;
        description: string;
      };
      path: string;
      cached: boolean;
      model: string;
      usage: OpenAI.Completions.CompletionUsage | undefined;
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
