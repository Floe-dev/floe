import { inspect } from "node:util";
// import { api } from "@floe/lib/axios";
import { getRulesets } from "@floe/lib/rules";
// import type { AiLintDiffResponse } from "@floe/requests/at-lint-diff/_get";
import simpleGit from "simple-git";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import { fetchGitReviewComments } from "@floe/requests/git/review-comments/_get";
// import { createGitReviewComment } from "@floe/requests/review-comments/_post";

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

    const basehead = `${baseSha}...${headSha}`;
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
    const filesMatchingRulesets = files
      .map((file) => {
        const matchingRulesets = rulesets.filter((ruleset) => {
          return ruleset.include.some((pattern) => {
            return minimatch(file.path, pattern);
          });
        });

        return {
          ...file,
          matchingRulesets,
        };
      })
      .filter(({ matchingRulesets }) => matchingRulesets.length > 0);

    if (filesMatchingRulesets.length === 0) {
      console.log(chalk.dim("No matching files in diff to review\n"));

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

    console.log(111111, rulesets);
    console.log(22222, files);

    // const response = await api.get<AiLintDiffResponse>("/api/v1/ai-lint-diff", {
    //   params: {
    //     owner,
    //     repo,
    //     baseSha,
    //     headSha,
    //     rulesets: rulesetsWithRules,
    //   },
    // });

    // const comments = await fetchGitReviewComments({
    //   owner,
    //   repo,
    //   pullNumber,
    // });

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
