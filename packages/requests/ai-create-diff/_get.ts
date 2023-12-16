import type { OpenAI } from "openai";

export type AiCreateDiffResponse =
  | OpenAI.Chat.Completions.ChatCompletion
  | undefined;
