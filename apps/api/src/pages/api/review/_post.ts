import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { minimatch } from "minimatch";
import type { AiLintDiffResponse } from "@floe/requests/at-lint-diff/_get";
import type { PostReviewResponse } from "@floe/requests/review/_post";
import { querySchema } from "@floe/requests/review/_post";
import { createChecksum } from "~/utils/checksum";
import type {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "~/types/private-middleware";
import { defaultResponder } from "~/lib/helpers/default-responder";
import { contents } from "~/lib/normalizedGitProviders/content";
import { getCacheKey } from "~/utils/get-cache-key";
import { stringToLines } from "~/utils/string-to-lines";
import { zParse } from "~/utils/z-parse";
import { exampleContent, exampleOutput, exampleRule } from "./example";
import { getUserPrompt, systemInstructions } from "./prompts";

type Violation = Pick<
  NonNullable<PostReviewResponse>["violations"][number],
  "code" | "fix" | "errorDescription" | "startLine" | "endLine"
>;

async function handler({
  queryObj,
  workspace,
}: NextApiRequestExtension): Promise<PostReviewResponse> {
  const { content, startLine, rule, path } = zParse(querySchema, queryObj);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  /**
   * Convert to lines object that is more LLM friendly
   */
  const lines = stringToLines(content, startLine);

  const response = await openai.chat.completions.create({
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
  });

  const responseJson = JSON.parse(
    response.choices[0].message.content ?? "{}"
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

  return {
    path,
    violations,
    cached: false,
  };

  /**
   * Check if value is cached
   */
  // const checksumKey = JSON.stringify({
  //   systemInstructions,
  //   compareInfo,
  //   rulesets: parsed.rulesets,
  // });
  // const checksum = createChecksum(checksumKey);
  // const cacheKey = getCacheKey(1, workspace.slug, "ai-lint-diff", checksum);
  // const cachedVal = await kv.get<AiLintDiffResponse>(cacheKey);

  // if (cachedVal) {
  //   console.log("Cache hit");
  //   return {
  //     ...cachedVal,
  //     cached: true,
  //   };
  // }
  // console.log("Cache miss");

  /**
   * We only want to evaluate diffs that are included in a ruleset
   */
  // const diffsToEvaluate = compareInfo.diffs
  //   // Do not evaluate deleted files
  //   .filter((diff) => !diff.isDeleted)
  //   .map((diff) => {
  //     const filename = diff.filename;
  //     const matchingRulesets = parsed.rulesets.filter((ruleset) => {
  //       return ruleset.include.some((pattern: string) => {
  //         return minimatch(filename, pattern);
  //       });
  //     });

  //     return {
  //       diff,
  //       matchingRulesets,
  //     };
  //   })
  //   .filter(({ matchingRulesets }) => matchingRulesets.length > 0);

  // const responses = await Promise.all(
  // diffsToEvaluate.map(async ({ diff, matchingRulesets }) => {
  //   const flatRules = matchingRulesets
  //     .flatMap((ruleset) => ruleset.rules)
  //     .filter((rule, index, self) => {
  //       return self.findIndex((r) => r.code === rule.code) === index;
  //     });

  /**
   * Fetch the entire file from the contents URL
   */
  // const content = (await contents(
  //   diff.contentsUrl,
  //   workspace,
  //   res
  // )) as unknown as string; // TODO: Can handle this better later on

  /**
   * Convert to lines object that is more LLM friendly
   */
  // const lines = stringToLines(content);

  // const response = await openai.chat.completions.create({
  //   // model: "gpt-4-1106-preview",
  //   model: "gpt-3.5-turbo-1106",
  //   temperature: 0,
  //   response_format: { type: "json_object" },
  //   // Last updated date
  //   seed: 231116,
  //   messages: [
  //     {
  //       role: "system",
  //       content: systemInstructions,
  //     },
  //     {
  //       role: "user",
  //       content: generateUserPrompt(exampleContent, exampleRules),
  //     },
  //     {
  //       role: "assistant",
  //       content: JSON.stringify(exampleOutput),
  //     },
  //     {
  //       role: "user",
  //       content: generateUserPrompt(lines, flatRules),
  //     },
  //   ],
  // });

  // const responseJson = JSON.parse(
  //   response.choices[0].message.content ?? "{}"
  // ) as {
  //   violations: Violation[];
  // };

  //   return {
  //     filename: diff.filename,
  // violations: responseJson.violations.map((violation) => {
  //   const rule = flatRules.find((r) => r.code === violation.code);
  //   let lineContent = "";

  //   for (let i = violation.startLine; i <= violation.endLine; i++) {
  //     lineContent += `${lines[i]}${i !== violation.endLine ? "\n" : ""}`;
  //   }

  //   return {
  //     ...violation,
  //     lineContent,
  //     level: rule?.level,
  //     description: rule?.description,
  //   };
  // }),
  //   };
  // })
  // );

  // Remove duplicates of violations
  // const deduped = responses.map((response) => {
  //   const violations = response.violations.filter(
  //     (violation, index, self) =>
  //       self.findIndex(
  //         (v) => JSON.stringify(v) === JSON.stringify(violation)
  //       ) === index
  //   );

  //   return {
  //     ...response,
  //     violations,
  //   };
  // });

  // const response = {
  //   files: deduped,
  // };

  // await kv.set(cacheKey, response);
  // // Cache for 1 week
  // await kv.expire(checksum, 60 * 24 * 7);

  // return {
  //   ...response,
  //   cached: false,
  // };
}

export default defaultResponder(handler);
