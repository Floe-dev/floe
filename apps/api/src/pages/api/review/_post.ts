import { kv } from "@vercel/kv";
import type OpenAI from "openai";
import { notEmpty } from "@floe/lib/not-empty";
import type { PostReviewResponse } from "@floe/requests/review/_post";
import { querySchema } from "@floe/requests/review/_post";
import { createChecksum } from "~/utils/checksum";
import type { NextApiRequestExtension } from "~/types/private-middleware";
import { defaultResponder } from "~/lib/helpers/default-responder";
import { getCacheKey } from "~/utils/get-cache-key";
import { stringToLines } from "~/utils/string-to-lines";
import { zParse } from "~/utils/z-parse";
import { createCompletion } from "~/lib/ai";
import { exampleContent, exampleOutput, exampleRule } from "./example";
import { getUserPrompt, systemInstructions } from "./prompts";

type OpenAIOptions =
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;

async function handler({
  body,
  workspace,
}: NextApiRequestExtension): Promise<PostReviewResponse> {
  const { content, startLine, rule, path } = zParse(
    querySchema,
    body.params as Record<string, unknown>
  );

  /**
   * Convert to lines object that is more LLM friendly
   */
  const lines = stringToLines(content, startLine);

  const openAICompletionOptions: OpenAIOptions = {
    model: "gpt-4-1106-preview",
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
    user: workspace.id,
  };

  /**
   * Check if value is cached
   */
  const checksumKey = JSON.stringify(openAICompletionOptions);
  const checksum = createChecksum(checksumKey);
  const cacheKey = getCacheKey(2, workspace.slug, "review_post", checksum);
  const cachedVal = await kv.get<PostReviewResponse>(cacheKey);

  if (false) {
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

  const completion = await createCompletion({
    name: "review",
    provider: "openai",
    providerOptions: openAICompletionOptions,
    userId: workspace.id,
    metadata: {
      slug: workspace.slug,
    },
  });

  const responseJson = JSON.parse(
    completion.choices[0].message.content ?? "{}"
  ) as {
    violations: {
      description: string;
      startLine: number;
      textToReplace: string;
      replaceTextWithFix: string;
    }[];
  };

  const violations = responseJson.violations
    .map((violation) => {
      // 1) Get the lines of content we want to replace
      const lineContent = content
        .split("\n")
        .slice(violation.startLine - startLine)
        .slice(0, violation.textToReplace.split("\n").length)
        .join("\n");

      // 2) Check if the content is indeed replaceable. If the LLM returns the
      //    wrong lineNumber, it may not be. In this case we should ignore this result.
      if (!lineContent.includes(violation.textToReplace)) {
        return;
      }

      // 3) Replace the first instance of the original content with the suggested fix
      //
      const replacedContent = lineContent.replace(
        violation.textToReplace,
        violation.replaceTextWithFix
      );

      const numberOfLines = violation.textToReplace.split("\n").length;
      console.log(777777, numberOfLines);

      // 4) Get the endLine number
      const endLine = Number(violation.startLine) + numberOfLines - 1;

      console.log(888888, violation.startLine, endLine);

      return {
        ...violation,
        endLine,
        suggestedFix:
          violation.textToReplace === "undefined" ? undefined : replacedContent,
        //
        content: lineContent,
      };
    })
    .filter(notEmpty);

  const response: PostReviewResponse = {
    path,
    violations,
    cached: false,
    model: completion.model,
    usage: completion.usage,
    rule: {
      code: rule.code,
      level: rule.level,
      description: rule.description,
    },
  };

  // Cache for 1 week
  await kv.set(cacheKey, response, {
    ex: 60 * 24 * 7,
  });

  return response;
}

export default defaultResponder(handler);
