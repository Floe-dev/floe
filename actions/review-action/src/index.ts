import { inspect } from "node:util";
import { getRulesets } from "@floe/lib/rules";
import {
  getErrorsByFile,
  getReviewsByFile,
  getFilesMatchingRulesets,
  checkIfUnderEvaluationLimit,
} from "@floe/features/reviews";
import { notEmpty } from "@floe/lib/not-empty";
import { getFloeConfig } from "@floe/lib/get-floe-config";
import simpleGit from "simple-git";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import { fetchGitReviewComments } from "@floe/requests/git/review-comments/_get";
import { createGitReviewComment } from "@floe/requests/git/review-comments/_post";

async function run() {
  try {
    const headRef = process.env.GITHUB_HEAD_REF;
    const baseRef = process.env.GITHUB_BASE_REF;
    const repo = github.context.payload.repository?.name;
    const owner = github.context.payload.repository?.owner.login;
    const headSha = github.context.payload.pull_request?.head.sha;
    const pullNumber = github.context.payload.pull_request?.number;

    if (!headRef || !baseRef || !headSha || !owner || !repo || !pullNumber) {
      throw new Error(
        `The following values are missing: ${[
          !headRef && "headRef",
          !baseRef && "baseRef",
          !headSha && "headSha",
          !owner && "owner",
          !repo && "repo",
          !pullNumber && "pullNumber",
        ]
          .filter(notEmpty)
          .join(", ")}`
      );
    }

    const config = getFloeConfig();

    const basehead = `origin/${baseRef}..origin/${headRef}`;
    /**
     * Fetch all branches. This is needed to get the correct diff.
     */
    if (!process.env.FLOE_TEST_MODE) {
      await simpleGit().fetch();
    }
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

    if (!reviewsByFile) {
      process.exit(0);
    }

    const comments = await fetchGitReviewComments({
      owner,
      repo,
      pullNumber,
    });

    /**
     * Check if comments already exist for a violation
     */
    const newViolations = reviewsByFile
      .flatMap((reviews) => {
        return reviews.evaluationsResponse.flatMap((evaluationResponse) => {
          return evaluationResponse.review.violations?.flatMap((violation) => {
            const existingComment = comments.data.find((comment) => {
              return (
                comment.path === reviews.path &&
                comment.position === violation.endLine &&
                // @ts-expect-error - Will be fixed in next PR
                comment.body.includes(violation.description) &&
                comment.user.login ===
                  (process.env.FLOE_BOT_NAME ?? "floe-app[bot]")
              );
            });

            if (!existingComment) {
              return {
                ...violation,
                path: reviews.path,
              };
            }

            return null;
          });
        });
      })
      .filter(notEmpty);

    /**
     * Create comments for new violations
     */
    newViolations.forEach(async (violation) => {
      const body = `${violation.description}\n${
        violation.linesWithFix
          ? `\`\`\`suggestion\n${violation.linesWithFix}\n\`\`\``
          : ""
      }`;

      const newComment = await createGitReviewComment({
        path: violation.path,
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

    const errorsByFile = getErrorsByFile(reviewsByFile);

    const combinedErrorsAndWarnings = errorsByFile.reduce(
      (acc, { errors, warnings }) => ({
        errors: acc.errors + errors,
        warnings: acc.warnings + warnings,
      }),
      {
        errors: 0,
        warnings: 0,
      }
    );

    // TODO: Add comment summary

    if (combinedErrorsAndWarnings.errors > 0) {
      core.setFailed(
        `Floe review failed with ${combinedErrorsAndWarnings.errors} errors.`
      );
    }
  } catch (error) {
    core.error(inspect(error));

    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

void run();
