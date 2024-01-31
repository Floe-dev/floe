import OpenAI from "openai";
import {
  querySchema,
  type CreatePRResponse,
} from "@floe/requests/create/pr/_post";
import type { NextApiRequestExtension } from "~/types/middleware";
import { defaultResponder } from "~/lib/middleware/default-responder";
import { getHandlebarsVariables, handlebars } from "~/utils/handlebars";
import { compare } from "~/lib/normalizedGitProviders/compare";
import {
  commitsToString,
  diffsToString,
} from "~/lib/normalizedGitProviders/strings";
import { zParse } from "~/utils/z-parse";
import { WritingAssistant } from "~/lib/ai/writing-assistant";

function compileTemplate(
  rawTemplate: string,
  commits: string,
  diffs: string,
  meta: Record<string, unknown> = {}
) {
  const template = handlebars.compile(rawTemplate);
  const templateVariablesArr = getHandlebarsVariables(rawTemplate);
  const templateVariables = templateVariablesArr.reduce(
    (acc, variable) => ({
      ...acc,
      [variable]: meta[variable] ?? "[NEEDS_HUMAN_INPUT]",
    }),
    {}
  );

  /**
   * Convert default Floe and custom variables
   */
  return template({
    FLOE_COMMITS: commits,
    FLOE_DIFFS: diffs,
    ...templateVariables,
  });
}

function generateUserPrompt(
  commits: string,
  diffs: string,
  rules: string,
  template: string
) {
  const promptTemplate = handlebars.compile(
    `
    Please generate some content based on the following information:

    GLOBAL RULES:
    {{rules}}

    TEMPLATE:
    {{template}}

    CONTEXT:
    Commits:
    {{commits}}

    Diffs:
    {{diffs}}`
  );

  return promptTemplate({
    rules,
    diffs,
    commits,
    template,
  });
}

/**
 * Response Handler
 */
async function handler({
  queryObj,
  workspace,
}: NextApiRequestExtension): Promise<CreatePRResponse> {
  const parsed = zParse(querySchema, queryObj);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  /**
   * System Instructions should err on the side of caution. Instruct the model to say 'NEEDS_HUMAN_INPUT' if it doesn't know what to do.
   */
  const systemInstructions = [
    "Your job is to generate text content based on a user-supplied TEMPLATE, a list of GLOBAL RULES, and CONTEXT (commits, diffs, etc). You must obey the follow rules:",
    "1. The user will supply you with a Handlebars TEMPLATE. You must only evaluate content within double curly braces. Ex {{ some user instructions }}.",
    "2. If you don't know what to do, replace the content with '[NEEDS_HUMAN_INPUT]'. For example, '{{ Release Number - 0.0.0 }}' should be replaced with <NEEDS_HUMAN_INPUT> if no release number was provided.",
    "3. When evaluating content, you MUST follow the instructions in the braces, and the list of GLOBAL RULES.",
  ].join("\n");

  const compareInfo = await compare(parsed, workspace);

  if (!compareInfo) {
    // res.status(400).json({
    //   error: "Could not fetch commits or diffs",
    // });

    return;
  }

  const commitsString = commitsToString(compareInfo.commits);
  const diffsString = diffsToString(compareInfo.diffs);

  /**
   * Return template with Floe and environment variables replaced
   */
  const compiledTemplate = compileTemplate(
    parsed.template,
    commitsString,
    diffsString,
    parsed.meta
  );

  const assistant = new WritingAssistant({
    workspaceId: workspace.id,
    provider: "openai",
    // providerOptions: {
    //   model: "gpt-4-1106-preview",
    // },
  });

  const thread = await assistant.createThread();
  await assistant.appendMessage(thread.id, "");

  /**
   * TODO:
   * Consider using Vectorestore to help reduce token usage
   */
  const response = await openai.chat.completions.create({
    // gpt-3.5-turbo-1106
    model: "gpt-4-1106-preview",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: systemInstructions,
      },
      {
        role: "user",
        content: generateUserPrompt(
          commitsString,
          diffsString,
          parsed.rulesets.join("\n"),
          compiledTemplate
        ),
      },
    ],
  });

  return response;
}

export default defaultResponder(handler);
