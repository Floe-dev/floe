import { z } from "zod";
import type OpenAI from "openai";
export declare const querySchema: z.ZodObject<
  {
    path: z.ZodString;
    content: z.ZodString;
    startRow: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    rule: z.ZodObject<
      {
        code: z.ZodString;
        level: z.ZodUnion<[z.ZodLiteral<"error">, z.ZodLiteral<"warn">]>;
        description: z.ZodString;
      },
      "strip",
      z.ZodTypeAny,
      {
        code: string;
        level: "error" | "warn";
        description: string;
      },
      {
        code: string;
        level: "error" | "warn";
        description: string;
      }
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    path: string;
    rule: {
      code: string;
      level: "error" | "warn";
      description: string;
    };
    content: string;
    startRow: number;
  },
  {
    path: string;
    rule: {
      code: string;
      level: "error" | "warn";
      description: string;
    };
    content: string;
    startRow?: number | undefined;
  }
>;
export type PostReviewResponse =
  | {
      violations: {
        description: string | undefined;
        rowsWithFix: string | undefined;
        startRow: number;
        endRow: number;
        content: string;
      }[];
      level: "error" | "warn" | undefined;
      code: string;
      description: string;
      path: string;
      cached: boolean;
      model: string;
      usage: OpenAI.Completions.CompletionUsage | undefined;
    }
  | undefined;
export type PostReviewInput = z.infer<typeof querySchema>;
export declare function createReview({
  path,
  content,
  startRow,
  rule,
}: PostReviewInput): Promise<
  import("axios").AxiosResponse<PostReviewResponse, any>
>;
//# sourceMappingURL=_post.d.ts.map
