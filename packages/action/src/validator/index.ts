import { inspect } from "node:util";
import { api } from "@floe/lib/axios";
import { getRules } from "@floe/lib/rules";
import type { AiLintDiffResponse } from "@floe/types";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { createComment, fetchComments } from "./comments";

async function run() {
  try {
    const headSha = process.env.GITHUB_HEAD_REF;
    const baseSha = process.env.GITHUB_BASE_REF;

    if (!headSha || !baseSha) {
      throw new Error("Missing headSha or baseSha");
    }

    const owner = github.context.payload.repository?.owner.login;
    const repo = github.context.payload.repository?.name;
    const pullNumber = github.context.payload.pull_request?.number;

    if (!owner || !repo || !pullNumber) {
      throw new Error("Missing owner, repo, or prNumber");
    }

    // const { rulesetsWithRules } = getRules();

    // const response = await api.get<AiLintDiffResponse>("/api/v1/ai-lint-diff", {
    //   params: {
    //     owner,
    //     repo,
    //     baseSha,
    //     headSha,
    //     rulesets: rulesetsWithRules,
    //   },
    // });

    // const comments = await fetchComments({
    //   owner,
    //   repo,
    //   issueNumber,
    // });

    // console.log(11111, comments);
    // Test comment
    const newComment = await createComment({
      body: "Test comment",
      owner,
      repo,
      pullNumber,
    });
    console.log(22222, newComment);

    // response.data?.files.forEach((diff) => {
    //   if (diff.violations.length > 0) {
    //     diff.violations.forEach((violation) => {
    //       // Step 1: Check if the violation is already a comment on the PR
    //       // Step 2: Create a comment on the PR, update a comment, or do nothing
    //     });
    //   }
    // });

    // Add core.summary

    // core.debug(inspect(response.data));
  } catch (error) {
    core.error(inspect(error));

    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

void run();
