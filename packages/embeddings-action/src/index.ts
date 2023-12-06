import { getInput, setOutput, setFailed } from "@actions/core";
import { OpenAI } from "openai";
import { walk } from "./utils/walk";
import { getApi } from "./utils/api";

async function generateEmbeddings({
  docsRootPath,
  openAiKey,
  floeApiSecret,
  floeApiWorkspace,
}: {
  docsRootPath: string;
  openAiKey: string;
  floeApiSecret: string;
  floeApiWorkspace: string;
}) {
  const api = getApi(floeApiSecret, floeApiWorkspace);
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
  await api.post("/store-embeddings", {
    embeddings: embeddingResponse.data,
  });
}

async function run(): Promise<void> {
  const openAiKey: string = getInput("open-ai-key");
  const docsRootPath: string = getInput("docs-root-path");
  const floeApiSecret: string = getInput("floe-api-secret");
  const floeApiWorkspace: string = getInput("floe-api-workspace");

  try {
    await generateEmbeddings({
      openAiKey,
      docsRootPath,
      floeApiSecret,
      floeApiWorkspace,
    });
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
