import { api } from "@floe/lib/axios";
import { getRules } from "@floe/lib/rules";
import type { AiLintDiffResponse } from "@floe/types";
import * as github from "@actions/github";

async function run() {
  const headSHA = process.env.GITHUB_HEAD_REF;
  const baseSHA = process.env.GITHUB_BASE_REF;

  console.log(1111, headSHA, baseSHA);

  if (!headSHA || !baseSHA) {
    process.exit(1);
  }

  const owner = github.context.payload.repository?.owner.login;
  const repo = github.context.payload.repository?.name;
  const prNumber = github.context.payload.pull_request?.number;

  console.log(22222, owner, repo, prNumber);

  const { rulesetsWithRules } = getRules();

  const response = await api
    .get<AiLintDiffResponse>("/api/v1/ai-lint-diff", {
      params: {
        owner,
        repo,
        baseSHA,
        headSHA,
        rulesets: rulesetsWithRules,
      },
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Response error: ", error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in node.js
        console.log("Request error: ", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("An error occurred: ", error.message);
      }
      process.exit(1);
    });

  console.log(1111, response.data?.files);
}

void run();
