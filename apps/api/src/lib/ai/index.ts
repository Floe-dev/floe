import OpenAI from "openai";
import { Langfuse } from "langfuse";

interface ProviderOptions {
  openai: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
}

/**
 * Generate a chat completion and log to Langfuse
 */
export async function createCompletion({
  name,
  userId,
  metadata,
  provider,
  providerOptions,
}: {
  name: string;
  userId: string;
  metadata: Record<string, string>;
  provider: keyof ProviderOptions;
  providerOptions: ProviderOptions[typeof provider];
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
    metadata,
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

  return chatCompletion;
}
