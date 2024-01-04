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
}: {
  name: string;
  userId: string;
  metadata: Record<string, string>;
  provider: "openai";
  providerOptions;
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
    model: "gpt-3.5-turbo",
    modelParameters: {
      temperature: 0.9,
      maxTokens: 2000,
    },
    input: messages,
  });

  /**
   * Call the LLM
   * Eventually we may want to make calls to other providers here
   */
  const chatCompletion = await openai.chat.completions.create(
    openAICompletionOptions
  );

  // End generation - sets endTime
  generation.end({
    output: chatCompletion,
  });

  await langfuse.shutdownAsync();
}
