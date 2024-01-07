import { minimatch } from "minimatch";
import { createReview } from "@floe/requests/review/_post";
import type { Ruleset } from "./rules";
import type { File } from "./diff-parser";
import { pluralize } from "./pluralize";

export type EvalutationsByFile = {
  path: string;
  evaluations: {
    rule: {
      code: string;
      level: "error" | "warn";
      description: string;
    };
    hunk: {
      startLine: number;
      content: string;
    };
  }[];
}[];

/**
 * We only want to evaluate diffs that are included in a ruleset
 */
export function getFilesMatchingRulesets(files: File[], rulesets: Ruleset[]) {
  return files
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
}

/**
 * This function is used as a safeguard so we don't create too many requests. This is an expensive operation.
 */
export function checkIfUnderEvaluationLimit(
  evalutationsByFile: EvalutationsByFile,
  limit: number
) {
  const totalEvaluations = evalutationsByFile.reduce(
    (acc, { evaluations }) => acc + evaluations.length,
    0
  );

  if (totalEvaluations > limit) {
    throw new Error(
      `This command would create ${totalEvaluations} ${pluralize(
        totalEvaluations,
        "evaluation",
        "evaluations"
      )}. The limit is ${limit}. Re-run this command with a smaller selection, or increase the evaluation threshold.`
    );
  }
}

/**
 * Generate a review for each hunk and rule.
 * Output is an array of reviews grouped by file.
 */
export async function getReviewsByFile(evalutationsByFile: EvalutationsByFile) {
  return Promise.all(
    evalutationsByFile.map(async ({ path, evaluations }) => {
      const evaluationsResponse = await Promise.all(
        evaluations.map(async ({ rule, hunk }) => {
          const review = await createReview({
            path,
            content: hunk.content,
            startLine: hunk.startLine,
            rule,
          });

          return {
            review: {
              ...review.data,
              // Map rule to each violation. This is useful later on for logging
              violations: review.data?.violations.map((v) => ({
                ...v,
                ...rule,
                cached: review.data?.cached,
              })),
            },
            cached: review.data?.cached,
          };
        })
      );

      return {
        path,
        evaluationsResponse,
      };
    })
  );
}

/**
 * Generate a count of total errors and warnings for each file
 */
export function getErrorsByFile(
  reviewsByFile: Awaited<ReturnType<typeof getReviewsByFile>>
) {
  return reviewsByFile.map(({ path, evaluationsResponse }) => {
    const warningsAndErrors = evaluationsResponse.reduce(
      (acc, { review }) => {
        if (!review.violations) {
          return acc;
        }

        return {
          errors:
            acc.errors +
            review.violations.filter((v) => v.level === "error").length,
          warnings:
            acc.warnings +
            review.violations.filter((v) => v.level === "warn").length,
        };
      },
      {
        errors: 0,
        warnings: 0,
      }
    );

    return {
      path,
      evaluationsResponse,
      ...warningsAndErrors,
    };
  });
}

export type ErrorsByFile = ReturnType<typeof getErrorsByFile>;
