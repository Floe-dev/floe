import { z } from "zod";
import type OpenAI from "openai";
export declare const querySchema: z.ZodObject<{
    path: z.ZodString;
    content: z.ZodString;
    startLine: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    rule: z.ZodObject<{
        code: z.ZodString;
        level: z.ZodUnion<[z.ZodLiteral<"error">, z.ZodLiteral<"warn">]>;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        level: "error" | "warn";
        description: string;
    }, {
        code: string;
        level: "error" | "warn";
        description: string;
    }>;
}, "strip", z.ZodTypeAny, {
    path: string;
    startLine: number;
    content: string;
    rule: {
        code: string;
        level: "error" | "warn";
        description: string;
    };
}, {
    path: string;
    content: string;
    rule: {
        code: string;
        level: "error" | "warn";
        description: string;
    };
    startLine?: number | undefined;
}>;
export type PostReviewResponse = {
    violations: {
        description: string | undefined;
        linesWithFix: string | undefined;
        linesWithoutFix: string;
        startLine: number;
        endLine: number;
        textToReplace: string;
        replaceTextWithFix: string;
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
} | undefined;
export type PostReviewInput = z.infer<typeof querySchema>;
export declare function createReview({ path, content, startLine, rule, }: PostReviewInput): Promise<import("axios").AxiosResponse<PostReviewResponse, any>>;
//# sourceMappingURL=_post.d.ts.map