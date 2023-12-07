import fs from "node:fs";
import { getInput, setOutput, setFailed } from "@actions/core";
import { OpenAI } from "openai";
import { glob } from "glob";
import { v4 as uuidv4 } from "uuid";
import { Pinecone } from "@pinecone-database/pinecone";
import { walk } from "./utils/walk";
import { getApi } from "./utils/api";

async function similaritySearch({
  openAiKey,
  pineconeApiKey,
}: {
  openAiKey: string;
  pineconeApiKey: string;
}) {
  const openai = new OpenAI({
    apiKey: openAiKey,
  });

  const pinecone = new Pinecone({
    environment: "northamerica-northeast1-gcp",
    apiKey: pineconeApiKey,
  });

  const index = pinecone.Index("floe");

  /**
   * TODO: This should be a diff (or part of a diff) from a PR
   */
  const query = "[https://nextra.site](https://nextra.site)";

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });

  const ns = index.namespace("my-first-namespace");

  const result = await ns.query({
    vector: embeddingResponse.data[0].embedding,
    topK: 5,
    includeValues: false,
    includeMetadata: true,
  });

  console.log(33333, result.matches[0].metadata);
}

async function generateEmbeddings({
  docsRootPath,
  openAiKey,
  floeApiSecret,
  floeApiWorkspace,
  pineconeApiKey,
}: {
  docsRootPath: string;
  openAiKey: string;
  floeApiSecret: string;
  floeApiWorkspace: string;
  pineconeApiKey: string;
}) {
  // const api = getApi(floeApiSecret, floeApiWorkspace);
  // const embeddingSources = (await walk(docsRootPath)).filter(({ path }) =>
  //   /\.(md|mdx|mdoc)$/i.test(path)
  // );
  const files = await glob(`${docsRootPath}/**/*.{md,mdx,mdoc}`, {
    ignore: "node_modules/**",
  });
  const embeddingSources = files.map((path) => {
    const article = fs.readFileSync(path, { encoding: "utf8" });

    return {
      path,
      article,
    };
  });

  const openai = new OpenAI({
    apiKey: openAiKey,
  });

  const pinecone = new Pinecone({
    environment: "northamerica-northeast1-gcp",
    apiKey: pineconeApiKey,
  });

  const index = pinecone.Index("floe");

  const ns = index.namespace("my-first-namespace");

  console.log(1111111, embeddingSources);

  embeddingSources.forEach(async ({ path, article }, i: number) => {
    const id = uuidv4();

    /**
     * Step 1: Generate the embeddings
     */
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: article,
    });

    await ns.upsert([
      {
        id,
        values: embeddingResponse.data[0].embedding,
        metadata: {
          content: article,
          contentTokens: embeddingResponse.usage.total_tokens,
        },
      },
    ]);

    /**
     * Step 2: Store embeddings
     */
    // await api.post("/store-embeddings", {
    //   embeddings: embeddingResponse.data,
    // });
  });

  // const input = embeddingSources.map(({ path }) => path).join("\n");

  return;

  // console.log(1111111, embeddingResponse);
}

async function run(): Promise<void> {
  const openAiKey: string = getInput("open-ai-key");
  const docsRootPath: string = getInput("docs-root-path");
  const floeApiSecret: string = getInput("floe-api-secret");
  const floeApiWorkspace: string = getInput("floe-api-workspace");
  const pineconeApiKey: string = getInput("pinecone-api-key");

  try {
    // await generateEmbeddings({
    //   openAiKey,
    //   docsRootPath,
    //   floeApiSecret,
    //   floeApiWorkspace,
    //   pineconeApiKey,
    // });
    await similaritySearch({
      openAiKey,
      pineconeApiKey,
    });
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
