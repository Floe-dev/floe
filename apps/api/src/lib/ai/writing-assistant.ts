import OpenAI from "openai";

type ValueOf<T> = T[keyof T];

interface ProviderOptions {
  openai: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
}

// const instructions = [
//   "Your job is to generate text content based on a user-supplied TEMPLATE, a list of GLOBAL RULES, and CONTEXT (commits, diffs, etc). You must obey the follow rules:",
//   "1. The user will supply you with a Handlebars TEMPLATE. You must only evaluate content within double curly braces. Ex {{ some user instructions }}.",
//   "2. If you don't know what to do, replace the content with '[NEEDS_HUMAN_INPUT]'. For example, '{{ Release Number - 0.0.0 }}' should be replaced with <NEEDS_HUMAN_INPUT> if no release number was provided.",
//   "3. When evaluating content, you MUST follow the instructions in the braces, and the list of GLOBAL RULES.",
// ].join("\n");

const instructions = [
  "You are a technical writing assistant. Below, you are given some CONTEXT and RULES. For each user prompt, you must generate content based on the context.",
].join("\n");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class WritingAssistant {
  private workspaceId: string;
  private provider: keyof ProviderOptions;
  private providerOptions: ValueOf<ProviderOptions>;
  private assistant: ReturnType<typeof openai.beta.assistants.create>;

  constructor({
    workspaceId,
    provider, // providerOptions,
  }: {
    workspaceId: string;
    provider: keyof ProviderOptions;
    // providerOptions: ProviderOptions[typeof provider];
  }) {
    this.workspaceId = workspaceId;
    this.provider = provider;
    // this.providerOptions = providerOptions;
    this.assistant = openai.beta.assistants.create({
      name: "Documentation writing assistant",
      instructions,
      tools: [],
      model: "gpt-4-turbo-preview",
    });
  }

  async createThread() {
    return openai.beta.threads.create();
  }

  async appendMessage(threadId: string, message: string) {
    return openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });
  }

  async run(threadId: string) {
    // TODO: Add logging, token checks, etc

    return openai.beta.threads.runs.create(threadId, {
      assistant_id: (await this.assistant).id,
      // instructions: ...
    });
  }

  async getMessages(threadId: string) {
    return openai.beta.threads.messages.list(threadId);
  }
}
