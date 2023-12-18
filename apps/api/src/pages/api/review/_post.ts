import OpenAI from "openai";
import { kv } from "@vercel/kv";
import type { PostReviewResponse } from "@floe/requests/review/_post";
import { querySchema } from "@floe/requests/review/_post";
import { createChecksum } from "~/utils/checksum";
import type { NextApiRequestExtension } from "~/types/private-middleware";
import { defaultResponder } from "~/lib/helpers/default-responder";
import { getCacheKey } from "~/utils/get-cache-key";
import { stringToLines } from "~/utils/string-to-lines";
import { zParse } from "~/utils/z-parse";
import { exampleContent, exampleOutput, exampleRule } from "./example";
import { getUserPrompt, systemInstructions } from "./prompts";

type OpenAIOptions =
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;

type Violation = Pick<
  NonNullable<PostReviewResponse>["violations"][number],
  "code" | "suggestedFix" | "errorDescription" | "startLine" | "endLine"
>;

async function handler({
  body,
  workspace,
}: NextApiRequestExtension): Promise<PostReviewResponse> {
  const { content, startLine, rule, path } = zParse(
    querySchema,
    body.params as Record<string, unknown>
  );

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  /**
   * Convert to lines object that is more LLM friendly
   */
  const lines = stringToLines(content, startLine);

  const openAICompletionOptions: OpenAIOptions = {
    // model: "gpt-4-1106-preview",
    model: "gpt-3.5-turbo-1106",
    temperature: 0,
    response_format: { type: "json_object" },
    // Last updated date
    seed: 231116,
    messages: [
      {
        role: "system",
        content: systemInstructions,
      },
      {
        role: "user",
        content: getUserPrompt(exampleContent, exampleRule),
      },
      {
        role: "assistant",
        content: JSON.stringify(exampleOutput),
      },
      {
        role: "user",
        content: getUserPrompt(lines, rule),
      },
    ],
  };

  /**
   * Check if value is cached
   */
  const checksumKey = JSON.stringify(openAICompletionOptions);
  const checksum = createChecksum(checksumKey);
  const cacheKey = getCacheKey(1, workspace.slug, "review_post", checksum);
  const cachedVal = await kv.get<PostReviewResponse>(cacheKey);

  if (cachedVal) {
    console.log("Cache hit");
    // Update cache expiry for another week
    await kv.set(cacheKey, cachedVal, {
      ex: 60 * 24 * 7,
    });

    return {
      ...cachedVal,
      cached: true,
    };
  }
  console.log("Cache miss");

  const completion = await openai.chat.completions.create(
    openAICompletionOptions
  );

  const responseJson = JSON.parse(
    completion.choices[0].message.content ?? "{}"
  ) as {
    violations: Violation[];
  };

  const violations = responseJson.violations.map((violation) => {
    let lineContent = "";

    for (let i = violation.startLine; i <= violation.endLine; i++) {
      lineContent += `${lines[i]}${i !== violation.endLine ? "\n" : ""}`;
    }

    return {
      ...violation,
      lineContent,
      level: rule.level,
      description: rule.description,
    };
  });

  const response = {
    path,
    violations,
    cached: false,
  };

  // Cache for 1 week
  await kv.set(cacheKey, response, {
    ex: 60 * 24 * 7,
  });

  return response;
}

export default defaultResponder(handler);
