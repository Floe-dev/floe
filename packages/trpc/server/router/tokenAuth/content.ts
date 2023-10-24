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
        example: z.string(),
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
      Commits:
      ${resp?.commits}

      Diffs:
      ${resp?.gitDiff}
      `;
      // https://platform.openai.com/docs/models/gpt-3-5
      const tokenLimit = 4097 - 1000;
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

      console.log(111111, content);

      try {
        const response = await openai.chat.completions.create({
          model: GPTModel,
          messages: [
            {
              role: "system",
              content:
                "You are an assistant to a software developer. You help them to generate changelogs from git messages and diffs. You must include a frontmatter at the top of the response. Summarize commit messages and diffs, so not list the commit messages.",
            },
            {
              role: "user",
              content: `
                Generate a changelog from the following:
                Commits:
                Adds a commute calculator to Local Content
                wip
                the commute calculator displays the estimated driving or transit time to a specified destination
                Diff:
              `,
            },
            {
              role: "assistant",
              content: `
              ---
              title: "🚌 Commute calculator"
              ---
              Now you can quickly lookup the time and distance to points of interest relevant to you. Using the commute calculator, simply type in your destination and go!
              `,
            },
            {
              role: "user",
              content: `
              Generate a changelog from the following:
               ${content}
              `,
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
