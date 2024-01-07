import { inspect } from "node:util";
import { getRulesets } from "@floe/lib/rules";
import {
  getErrorsByFile,
  getReviewsByFile,
  getFilesMatchingRulesets,
  checkIfUnderEvaluationLimit,
} from "@floe/lib/reviews";
import { getFloeConfig } from "@floe/lib/get-floe-config";
import simpleGit from "simple-git";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import { fetchGitReviewComments } from "@floe/requests/git/review-comments/_get";
import { createGitReviewComment } from "@floe/requests/git/review-comments/_post";

async function run() {
  try {
    const headSha = github.context.payload.pull_request?.head.sha;
    const headRef = process.env.GITHUB_HEAD_REF;
    const baseRef = process.env.GITHUB_BASE_REF;

    if (!headRef || !baseRef || !headSha) {
      throw new Error("Missing head ref, base ref, or head sha");
    }

    const owner = github.context.payload.repository?.owner.login;
    const repo = github.context.payload.repository?.name;
    const pullNumber = github.context.payload.pull_request?.number;

    if (!owner || !repo || !pullNumber) {
      throw new Error("Missing owner, repo, or prNumber");
    }

    const config = getFloeConfig();

    const basehead = `${baseRef}...${headRef}`;
    const diffOutput = await simpleGit().diff([basehead]);

    /**
     * Parse git diff to more useable format
     */
    const files = parseDiffToFileHunks(diffOutput);

    /**
     * Get rules from Floe config
     */
    const rulesets = getRulesets();

    /**
     * We only want to evaluate diffs that are included in a ruleset
     */
    const filesMatchingRulesets = getFilesMatchingRulesets(files, rulesets);

    if (filesMatchingRulesets.length === 0) {
      core.info("No matching files in diff to review");

      process.exit(0);
    }

    /**
     * We want to evaluate each hunk against each rule. This can create a lot
     * of requests! But we can do this in parallel, and each request is
     * cached.
     */
    const evalutationsByFile = filesMatchingRulesets.map((file) => ({
      path: file.path,
      evaluations: file.matchingRulesets.flatMap((ruleset) =>
        ruleset.rules.flatMap((rule) =>
          file.hunks.map((hunk) => ({ rule, hunk }))
        )
      ),
    }));

    try {
      checkIfUnderEvaluationLimit(
        evalutationsByFile,
        Number(config.reviews?.maxDiffEvaluations ?? 5)
      );
    } catch (error) {
      if (error instanceof Error) {
        core.setFailed(error.message);

        return;
      }
    }

    const reviewsByFile = await getReviewsByFile(evalutationsByFile).catch(
      (error) => {
        if (error instanceof Error) {
          core.setFailed(error.message);
        }
      }
    );

    // const comments = await fetchGitReviewComments({
    //   owner,
    //   repo,
    //   pullNumber,
    // });

    // console.log(22222, comments.data);

    reviewsByFile?.forEach((reviews) => {
      reviews.evaluationsResponse.forEach((evaluationResponse) => {
        evaluationResponse.review.violations?.forEach(async (violation) => {
          const body =
            `${violation.description}\n` +
            `\`\`\`suggestion\n${violation.suggestedFix}\n\`\`\``;

          const newComment = await createGitReviewComment({
            path: reviews.path,
            commitId: headSha,
            body,
            owner,
            repo,
            pullNumber,
            line: violation.endLine,
            side: "RIGHT",
            ...(violation.endLine !== violation.startLine && {
              startSide: "RIGHT",
              startLine: violation.startLine,
            }),
          });

          console.log("Response: ", newComment.data);
        });
      });
    });

    // core.info(inspect(comments));
    // Test comment
    // const newComment = await createGitReviewComment({
    //   path: "README.md",
    //   commitId: "dfe29cb3a929d4f31f1ea84789f8f27ff0ebe5fc",
    //   body: "Test comment",
    //   owner: "NicHaley",
    //   repo: "floe-testerino",
    //   pullNumber: 1,
    // });
    // const newComment = await createComment({
    // }).catch((error) => {
    //   console.log(33333, error.message);
    // });
    // console.log(22222, newComment);

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
