import OpenAI from "openai";
import { db } from "@floe/db";
import { tokenUsage, subscription } from "@floe/db/models";
import { Langfuse } from "langfuse";
import * as Sentry from "@sentry/nextjs";
import type { z, AnyZodObject } from "zod";
import { HttpError } from "@floe/lib/http-error";
import { getMonthYearTimestamp } from "@floe/lib/get-month-year";
import { zParse } from "~/utils/z-parse";

interface ProviderOptions {
  openai: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
}

async function persistTokenUsage({
  workspaceId,
  promptTokens,
  completionTokens,
  proModel,
}: {
  workspaceId: string;
  promptTokens: number;
  completionTokens: number;
  proModel: boolean;
}) {
  const monthYear = getMonthYearTimestamp();
  const promptKey = proModel ? "proPromptTokens" : "basePromptTokens";
  const completionKey = proModel
    ? "proCompletionTokens"
    : "baseCompletionTokens";

  await db.tokenUsage.upsert({
    where: {
      workspaceId_monthYear: {
        workspaceId,
        monthYear,
      },
    },
    create: {
      monthYear,
      workspaceId,
      [promptKey]: promptTokens,
      [completionKey]: completionTokens,
    },
    update: {
      [promptKey]: {
        increment: promptTokens,
      },
      [completionKey]: {
        increment: completionTokens,
      },
    },
  });
}

const PRO_MODELS = ["gpt-4-1106-preview", "gpt-4"];

/**
 * Generate a chat completion and log to DB and Langfuse.
 * This function must be used to make all AI requests for tracking purposes.
 */
export async function createCompletion<T extends AnyZodObject>({
  name,
  metadata,
  provider,
  workspaceId,
  providerOptions,
  completionResponseSchema,
}: {
  name: string;
  metadata: Record<string, string>;
  provider: keyof ProviderOptions;
  workspaceId: string;
  providerOptions: ProviderOptions[typeof provider];
  completionResponseSchema: T;
}) {
  if (!process.env.LANGFUSE_SECRET_KEY || !process.env.LANGFUSE_PUBLIC_KEY) {
    throw new Error("Missing LANGFUSE_SECRET_KEY or LANGFUSE_PUBLIC_KEY");
  }

  const isUsingProModel = PRO_MODELS.includes(providerOptions.model);

  const result = await Promise.all([
    tokenUsage.findOne(workspaceId),
    subscription.getTokenLimits(workspaceId),
  ]);

  const usedTokens = result[0];
  const tokenLimits = result[1];

  if (!usedTokens) {
    throw new Error("Could not get token usage or token limits.");
  }

  const totalProTokens =
    usedTokens.proCompletionTokens + usedTokens.proPromptTokens;
  const totalBaseTokens =
    usedTokens.baseCompletionTokens + usedTokens.basePromptTokens;

  /**
   * Check if the workspace has exceeded their token limit
   */
  if (isUsingProModel) {
    if (totalProTokens >= tokenLimits.proTokenLimit) {
      throw new HttpError({
        statusCode: 402,
        message: "You have exceeded your Pro token limit.",
      });
    }
  } else if (totalBaseTokens >= tokenLimits.baseTokenLimit) {
    throw new HttpError({
      statusCode: 402,
      message: "You have exceeded your Basic token limit.",
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const langfuse = new Langfuse({
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  });

  const trace = langfuse.trace({
    name,
    userId: workspaceId,
    metadata: {
      env: process.env.NODE_ENV,
      ...metadata,
    },
  });

  // Example generation creation
  const generation = trace.generation({
    name: "chat-completion",
    model: providerOptions.model,
    modelParameters: {
      temperature: providerOptions.temperature,
      maxTokens: providerOptions.max_tokens,
    },
    input: providerOptions.messages,
  });

  let chatCompletion: OpenAI.Chat.Completions.ChatCompletion;

  /**
   * Call the LLM
   * Eventually we may want to make calls to other providers here
   */
  try {
    chatCompletion = await openai.chat.completions.create(providerOptions);
  } catch (error) {
    throw new HttpError({
      statusCode: 500,
      message: "Failed to get completion from LLM.",
    });
  }
  const { usage } = chatCompletion;

  // End generation - sets endTime
  generation.end({
    output: chatCompletion,
  });

  await langfuse.shutdownAsync();

  try {
    await persistTokenUsage({
      workspaceId,
      promptTokens: usage?.prompt_tokens ?? 0,
      completionTokens: usage?.completion_tokens ?? 0,
      proModel: isUsingProModel,
    });
  } catch (error) {
    /**
     * We've gotten this far and have a generated response, so we don't want to
     * throw an error here. Instead, we'll just log the error and continue.
     */
    Sentry.captureException(error);
    console.error(error);
  }

  /**
   * Safely parse the response from the LLM
   */
  const parsedJson = JSON.parse(
    chatCompletion.choices[0].message.content ?? "{}"
  ) as Record<string, unknown>;

  const parsedResponseContent: z.infer<T> = zParse(
    completionResponseSchema,
    parsedJson
  );

  return {
    ...chatCompletion,
    // Only pick the first choice since we will lock n at 1
    choices: [
      {
        ...chatCompletion.choices[0],
        message: {
          ...chatCompletion.choices[0].message,
          content: parsedResponseContent,
        },
      },
    ],
  };
}
