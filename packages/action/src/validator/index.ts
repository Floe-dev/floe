import { inspect } from "node:util";
import { api } from "@floe/lib/axios";
import { getRules } from "@floe/lib/rules";
import type { AiLintDiffResponse } from "@floe/requests/at-lint-diff/_get";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { createComment, fetchComments } from "./comments";
import { createReviewComment } from "@floe/requests/review-comments/_post";

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
    const newComment = await createReviewComment({
      path: "README.md",
      commitId: "dfe29cb3a929d4f31f1ea84789f8f27ff0ebe5fc",
      body: "Test comment",
      owner: "NicHaley",
      repo: "floe-testerino",
      pullNumber: 1,
    });
    // const newComment = await createComment({
    // }).catch((error) => {
    //   console.log(33333, error.message);
    // });
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
