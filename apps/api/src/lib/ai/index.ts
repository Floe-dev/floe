import OpenAI from "openai";
import { Langfuse } from "langfuse";
import type { z, AnyZodObject } from "zod";
import { zParse } from "~/utils/z-parse";

interface ProviderOptions {
  openai: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
}

/**
 * Generate a chat completion and log to Langfuse
 */
export async function createCompletion<T extends AnyZodObject>({
  name,
  userId,
  metadata,
  provider,
  providerOptions,
  completionResponseSchema,
}: {
  name: string;
  userId: string;
  metadata: Record<string, string>;
  provider: keyof ProviderOptions;
  providerOptions: ProviderOptions[typeof provider];
  completionResponseSchema: T;
}) {
  if (!process.env.LANGFUSE_SECRET_KEY || !process.env.LANGFUSE_PUBLIC_KEY) {
    throw new Error("Missing LANGFUSE_SECRET_KEY or LANGFUSE_PUBLIC_KEY");
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
    userId,
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

  /**
   * Call the LLM
   * Eventually we may want to make calls to other providers here
   */
  const chatCompletion = await openai.chat.completions.create(providerOptions);

  // End generation - sets endTime
  generation.end({
    output: chatCompletion,
  });

  await langfuse.shutdownAsync();

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
