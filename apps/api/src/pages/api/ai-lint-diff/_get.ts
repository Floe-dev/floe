import { z } from "zod";
import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { minimatch } from "minimatch";
import type { AiLintDiffResponse } from "@floe/types";
import { createChecksum } from "~/utils/checksum";
import type {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "~/types/private-middleware";
import { defaultResponder } from "~/lib/helpers/default-responder";
import { compare } from "~/lib/normalizedGitProviders/compare";
import { handlebars } from "~/utils/handlebars";
import { contents } from "~/lib/normalizedGitProviders/content";
import { getSubstringOccurrences } from "~/utils/substring-occurrences";
import { stringToLines } from "~/utils/string-to-lines";
import { exampleContent, exampleOutput, exampleRules } from "./example";
import { getCacheKey } from "~/utils/get-cache-key";

interface Violation {
  code: string;
  suggestion: string;
  substring: string;
  lineNumber: number;
}

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  baseSha: z.string(),
  headSha: z.string(),
  rulesets: z.array(
    z.object({
      include: z.array(z.string()),
      rules: z.array(
        z.object({
          code: z.string(),
          level: z.union([z.literal("error"), z.literal("warn")]),
          description: z.string(),
        })
      ),
    })
  ),
});

function generateUserPrompt(
  content: Record<string, string>,
  rules: {
    code: string;
    level: string;
    description: string;
  }[]
) {
  const promptTemplate = handlebars.compile(
    `
    Please lint the following content based on the following rules:

    RULES:
    {{{rules}}}

    CONTENT:
    {{{content}}}`
  );

  return promptTemplate({
    rules: JSON.stringify(rules),
    content: JSON.stringify(content),
  });
}

/**
 * Response Handler
 * TODO: Ideally, this endpoint should be as deterministic as possible. The endpoint should cache results in the future.
 */
async function handler(
  { queryObj, workspace }: NextApiRequestExtension,
  res: NextApiResponseExtension
): Promise<AiLintDiffResponse> {
  const parsed = querySchema.parse(queryObj);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemInstructions = [
    "Your job is to function as a prose linter. You will be given CONTENT (an object where keys represent lineNumbers, and values represent content) and RULES (a dictionary). For every rule:",
    "1. Determine places where the rule is violated. You must only report on supplied rules. DO NOT add rules that have not been provided by the user.",
    "2. Report the code of the rule.",
    "3. Suggest a possible suggestion for fixing the violation. The suggested solution should not be the same as the violation.",
    "4. Report the substring of the violation.",
    "5. Report the startLine and endLine numbers in which the violation occured.",
    "Return a JSON response object with the following shape:",
    `{
      "violations": [
        {
          "code": "...",
          "suggestion": "...",
          "substring": "...",
          "startLine": "...",
          "endLine": "...",
        },
        ...
      ]
    }`,
  ].join("\n");

  const compareInfo = await compare(parsed, workspace, res);

  if (!compareInfo) {
    res.status(400).json({
      error: "Could not fetch commits or diffs",
    });

    return;
  }

  /**
   * Check if value is cached
   */
  const checksumKey = JSON.stringify({
    systemInstructions,
    compareInfo,
    rulesets: parsed.rulesets,
  });
  const checksum = createChecksum(checksumKey);
  const cacheKey = getCacheKey(1, workspace.slug, "ai-lint-diff", checksum);
  const cachedVal = await kv.get<AiLintDiffResponse>(cacheKey);

  if (cachedVal) {
    console.log("Cache hit");
    return cachedVal;
  }

  /**
   * We only want to evaluate diffs that are included in a ruleset
   */
  const diffsToEvaluate = compareInfo.diffs
    // Do not evaluate deleted files
    .filter((diff) => !diff.isDeleted)
    .map((diff) => {
      const filename = diff.filename;
      const matchingRulesets = parsed.rulesets.filter((ruleset) => {
        return ruleset.include.some((pattern: string) => {
          return minimatch(filename, pattern);
        });
      });

      return {
        diff,
        matchingRulesets,
      };
    })
    .filter(({ matchingRulesets }) => matchingRulesets.length > 0);

  const responses = await Promise.all(
    diffsToEvaluate.map(async ({ diff, matchingRulesets }) => {
      const flatRules = matchingRulesets
        .flatMap((ruleset) => ruleset.rules)
        .filter((rule, index, self) => {
          return self.findIndex((r) => r.code === rule.code) === index;
        });

      /**
       * Fetch the entire file from the contents URL
       */
      const content = (await contents(
        diff.contentsUrl,
        workspace,
        res
      )) as unknown as string; // TODO: Can handle this better later on

      /**
       * Convert to lines object that is more LLM friendly
       */
      const lines = stringToLines(content);

      const response = await openai.chat.completions.create({
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
            content: generateUserPrompt(exampleContent, exampleRules),
          },
          {
            role: "assistant",
            content: JSON.stringify(exampleOutput),
          },
          {
            role: "user",
            content: generateUserPrompt(lines, flatRules),
          },
        ],
      });

      const responseJson = JSON.parse(
        response.choices[0].message.content ?? "{}"
      ) as {
        violations: Violation[];
      };

      return {
        filename: diff.filename,
        violations: responseJson.violations.flatMap((violation) => {
          const rule = flatRules.find((r) => r.code === violation.code);

          const lineContent = lines[violation.lineNumber];
          const occurrences = getSubstringOccurrences(
            lineContent,
            violation.substring
          );

          return occurrences.map((columns) => {
            return {
              ...violation,
              lineContent,
              level: rule?.level,
              description: rule?.description,
              columns,
            };
          });
        }),
      };
    })
  );

  // Remove duplicates of violations
  const deduped = responses.map((response) => {
    const violations = response.violations.filter(
      (violation, index, self) =>
        self.findIndex(
          (v) => JSON.stringify(v) === JSON.stringify(violation)
        ) === index
    );

    return {
      ...response,
      violations,
    };
  });

  const response = {
    files: deduped,
  };

  await kv.set(cacheKey, response);
  // Cache for 1 week
  await kv.expire(checksum, 60 * 24 * 7);

  return response;
}

export default defaultResponder(handler);
