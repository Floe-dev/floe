import { z } from "zod";
import OpenAI from "openai";
import { protectedTokenProcedure, router } from "../../trpc";
import { Octokit } from "@floe/utils";

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

    const commits = compareInfo.data.commits?.map((commit) => {
      return {
        sha: commit.sha,
        message: commit.commit.message,
      };
    });

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

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant to a software developer. You help them to generate a markdown file from a git diff.",
            },
            {
              role: "user",
              content: `
                Generate a markdown file using the following Diff and Commits. The output should be similar to the Example provided at the bottom.
                Diff: ${resp?.gitDiff}
                Commits: ${resp?.commits?.map((commit) => commit.message)}
                \n\n
                Example: ${input.example}`,
            },
          ],
        });

        return response.choices[0];
      } catch (error) {
        console.log(444444, error);
        return "yodo :(";
      }

      return resp;
    }),
});
