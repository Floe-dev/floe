import { getInput, setOutput, setFailed } from "@actions/core";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { walk } from "./utils/walk";

async function generateEmbeddings({
  docsRootPath,
  openAiKey,
}: {
  docsRootPath: string;
  openAiKey: string;
}) {
  const embeddingSources = (await walk(docsRootPath)).filter(({ path }) =>
    /\.(md|mdx|mdoc)$/i.test(path)
  );

  console.log(333333, embeddingSources);
  const input = embeddingSources.map(({ path }) => path).join("\n");

  const openai = new OpenAI({
    apiKey: openAiKey,
  });

  /**
   * Step 1: Generate the embeddings
   */
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });

  /**
   * Step 2: Store embeddings
   */
}

async function run(): Promise<void> {
  const openAiKey: string = getInput("open-ai-key");
  const docsRootPath: string = getInput("docs-root-path");

  try {
    await generateEmbeddings({
      openAiKey,
      docsRootPath,
    });
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
