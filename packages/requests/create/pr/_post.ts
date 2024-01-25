import { z } from "zod";
import type { OpenAI } from "openai";
import { api } from "../../api";

export type CreatePRResponse =
  | OpenAI.Chat.Completions.ChatCompletion
  | undefined;

export const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  pullNumber: z.number(),
  template: z.string(),
  rulesets: z.array(z.string().optional()).default([]),
  meta: z.record(z.string(), z.any()).optional(),
});

export type PostCreatePrResponse =
  | {
      content: string;
    }
  | undefined;

export type PostCreatePrInput = z.input<typeof querySchema>;

export async function createFromPr({
  owner,
  repo,
  pullNumber,
  template,
  rulesets,
  meta,
}: PostCreatePrInput) {
  return api.post<PostCreatePrResponse>("/api/v1/create/pr", {
    owner,
    repo,
    pullNumber,
    template,
    rulesets,
    meta,
  });
}
