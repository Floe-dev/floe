import { z } from "zod";
import OpenAI from "openai";
import { protectedTokenProcedure, router } from "../../trpc";
import { Octokit } from "@floe/utils";
import { encodingForModel } from "js-tiktoken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    return {
      commits,
      gitDiff,
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    return null;
  }
}

export const contentRouter = router({
  generate: protectedTokenProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        baseSha: z.string(),
        headSha: z.string(),
        prompt: z.object({
          system: z.string(),
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

      let content = `
      Here's an example of an interaction:

      ---

      User:

      Commits:
      ${input.prompt.mock_commits}

      Diff:
      ${input.prompt.mock_diff}

      ---

      Assistant:
      ${input.prompt.mock_output}
      
      ---

      Now you try!

      User:

      Commits:
      ${resp?.commits}

      Diff:
      ${resp?.gitDiff}

      Assistant:
    `;
      // https://platform.openai.com/docs/models/gpt-3-5
      const tokenLimit = 8000 - 1000;
      const GPTModel = "gpt-4";
      const enc = encodingForModel(GPTModel);
      const encoding = enc.encode(content);
      console.log("Estimated diff tokens: ", encoding.length);

      /**
       * Truncate content if too long
       */
      if (encoding.length > tokenLimit) {
        const splitRatio = encoding.length / tokenLimit;
        content = content.substring(0, Math.floor(content.length / splitRatio));

        const newEncoding = enc.encode(content);
        console.log(
          "Estimated diff tokens after truncated: ",
          newEncoding.length
        );
      }

      try {
        const response = await openai.chat.completions.create({
          model: GPTModel,
          messages: [
            {
              role: "system",
              content: input.prompt.system,
            },
            {
              role: "user",
              content,
            },
          ],
        });

        return response;
      } catch (error: any) {
        console.error("Error:", error.message);
        throw new Error(error.message);
      }
    }),
});
