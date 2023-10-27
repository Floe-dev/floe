import { z } from "zod";
import OpenAI from "openai";
import { protectedProcedure, router } from "../trpc";
import { Octokit } from "@floe/utils";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { encodingForModel } from "js-tiktoken";
import { mock } from "node:test";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function loadDocuments(accessToken: string) {
  console.log("Loading docs");
  const loader = new GithubRepoLoader("https://github.com/Floe-dev/floe", {
    branch: "main",
    recursive: true,
    unknown: "warn",
    accessToken,
  });
  const docs = await loader.load();
  console.log("Docs loaded", docs);
  return docs;
}

async function getGitHubGitDiff(
  owner: string,
  repo: string,
  base: string,
  head: string,
  octokit: Octokit
) {
  try {
    const compareInfo = await octokit.request(
      // could make this more open ended
      `GET /repos/{owner}/{repo}/compare/{base}...{head}`,
      {
        owner,
        repo,
        base,
        head,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const commits = compareInfo.data.commits
      ?.map((commit) => `${commit.sha}: ${commit.commit.message}`)
      .join("\n");

    const ignoreFiles = [
      "package-lock.json",
      "yarn.lock",
      "Gemfile.lock",
      ".gitignore",
      "node_modules",
      "bower_components",
      "vendor",
      "composer.lock",
      ".DS_Store",
      ".vscode",
      ".idea",
      ".npmrc",
      ".yarnrc",
      "yarn-error.log",
      "yarn-debug.log",
      "error_log",
      "Thumbs.db",
      ".cache",
      "coverage",
      ".env",
      ".env.local",
      ".env.development",
      ".env.production",
      "npm-debug.log",
      "log.txt",
      ".log",
      "logs",
      "tmp",
      "build",
      "dist",
      ".git",
      "*.swp",
      "test-results.xml",
      "pnpm-lock.yaml",
    ];

    // Access the diff information
    const gitDiff = compareInfo.data.files?.reduce((acc, file) => {
      if (ignoreFiles.includes(file.filename)) {
        return acc;
      }

      return acc + `filename: ${file.filename}\n${file.patch}\n\n`;
    }, "");

    const diffDocs = compareInfo.data.files
      ?.filter((file) => !ignoreFiles.includes(file.filename))
      .map(
        (file) =>
          new Document({
            pageContent: `filename: ${file.filename}\nsha: ${file.sha}\ndiff: ${file.patch}\n\n`,
          })
      );

    return {
      commits,
      gitDiff,
      diffDocs,
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    return null;
  }
}

export const aiRouter = router({
  generateFromDiff: protectedProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        baseSha: z.string(),
        headSha: z.string(),
        prompt: z.object({
          instructions: z.string(),
          mock_output: z.string(),
          mock_diff: z.string(),
          mock_commits: z.string(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const resp = await getGitHubGitDiff(
        input.owner,
        input.repo,
        input.baseSha,
        input.headSha,
        ctx.octokit
      );

      const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo-16k-0613",
      });
      const directory = "./vectorstore";
      const embeddings = new OpenAIEmbeddings();

      const vectorStore = await HNSWLib.fromDocuments(
        resp?.diffDocs ?? [],
        embeddings
      );
      await vectorStore.save(directory);

      const loadedVectorStore = await HNSWLib.load(
        directory,
        new OpenAIEmbeddings()
      );
      // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
      const chain = RetrievalQAChain.fromLLM(
        model,
        loadedVectorStore.asRetriever()
      );
      const res = await chain.call({
        query: `What can you tell me about the the code diff?`,
      });

      console.log(11111, res);
      return res;

      // const textSplitter = new RecursiveCharacterTextSplitter({
      //   chunkSize: 1000,
      //   chunkOverlap: 100,
      // });

      return null;

      const promptTemplate = PromptTemplate.fromTemplate(`
        Instructions:
        {instructions}

        Here's an example of an interaction:

        User:

        Commits:
        {mock_commits}

        Diff:
        {mock_diff}

        Assistant:
        {mock_ouput}
        
        Now you try!

        User:

        Commits:
        {commits}

        Diff:
        {diff}

        Assistant:
      `);

      // const chain = promptTemplate.pipe(model);

      try {
        const result = await chain.invoke({
          instructions: input.prompt.instructions,
          mock_commits: input.prompt.mock_commits,
          mock_diff: input.prompt.mock_diff,
          mock_ouput: input.prompt.mock_output,
          commits: resp?.commits ?? "",
          diff: resp?.gitDiff ?? "",
        });

        return result;
      } catch (error: any) {
        console.error("Error:", error.message);
        throw new Error(error.message);
      }
    }),
});
