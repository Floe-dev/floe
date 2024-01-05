import { createReview } from "@floe/requests/review/_post";
import { pluralize } from "@floe/lib/pluralize";
import { diffWords } from "diff";
import { confirm } from "@inquirer/prompts";

const chalkImport = import("chalk").then((m) => m.default);

type EvalutationsByFile = {
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

export async function checkIfUnderEvaluationLimit(
  evalutationsByFile: EvalutationsByFile,
  limit: number
) {
  const chalk = await chalkImport;

  const totalEvaluations = evalutationsByFile.reduce(
    (acc, { evaluations }) => acc + evaluations.length,
    0
  );

  if (totalEvaluations > limit) {
    console.log(
      chalk.red(
        `This command would create ${totalEvaluations} ${pluralize(
          totalEvaluations,
          "evaluation",
          "evaluations"
        )}. The limit is ${limit}. Re-run this command with a smaller selection, or increase the evaluation threshold.`
      )
    );
    process.exit(1);
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

/**
 * Log errors and warnings
 */
export async function logViolations(
  errorsByFile: ReturnType<typeof getErrorsByFile>
) {
  const chalk = await chalkImport;

  // eslint-disable-next-line @typescript-eslint/await-thenable -- Actually we do need to await this
  await errorsByFile.reduce(
    // @ts-expect-error -- Not an issue
    async (
      accumulatorPromise,
      { path, errors, warnings, evaluationsResponse }
    ) => {
      const accumulator = await accumulatorPromise;
      // await Promise.all(
      //   errorsByFile.map(
      //     async ({ path, errors, warnings, evaluationsResponse }) => {
      let errorLevel = {
        symbol: chalk.white.bgGreen("  PASS  "),
        level: "pass",
      };

      if (warnings > 0) {
        errorLevel = {
          symbol: chalk.white.bgYellow("  WARN  "),
          level: "warn",
        };
      }

      if (errors > 0) {
        errorLevel = {
          symbol: chalk.white.bgRed("  FAIL  "),
          level: "fail",
        };
      }

      console.log(`${errorLevel.symbol} 📂 ${path}\n`);

      if (errors === 0 && warnings === 0) {
        console.log(chalk.dim("No violations found for current selection\n"));
      }

      /**
       * Log violations
       */
      const violations = evaluationsResponse.flatMap(
        (e) => e.review.violations
      );

      // eslint-disable-next-line @typescript-eslint/await-thenable -- Actually we do need to await this
      const fileViolations = await violations.reduce(
        // @ts-expect-error -- Not an issue
        async (accumulatorPromise2, violation) => {
          const accumulator2 = await accumulatorPromise2;

          if (!violation) {
            return [...accumulator2];
          }

          const icon = violation.level === "error" ? "❌" : "⚠️ ";

          /**
           * Log violation code and description
           */
          console.log(
            chalk.bold(
              `${icon} ${violation.code} @@${violation.startLine},${violation.endLine}:`
            )
          );

          if (!violation.suggestedFix) {
            console.log("➖", chalk.dim(violation.content));
            console.log("➕", "No fix available");

            return [...accumulator2];
          }

          const diff = diffWords(violation.content, violation.suggestedFix);

          let consoleStrAdded = "";
          let consoleStrRemoved = "";

          diff.forEach((part) => {
            // green for additions, red for deletions
            // grey for common parts
            if (part.added) {
              consoleStrAdded += chalk.green(part.value);
              return;
            }

            if (part.removed) {
              consoleStrRemoved += chalk.red(part.value);
              return;
            }

            consoleStrAdded += chalk(part.value);
            consoleStrRemoved += chalk.dim(part.value);
          });

          console.log("➖", consoleStrRemoved);
          console.log("➕", consoleStrAdded);

          const answer = await confirm({ message: "Continue?" });

          return [...accumulator2, answer];
        },
        Promise.resolve([])
      );

      return [...accumulator, fileViolations];
    },
    Promise.resolve([])
  );
}

/**
 * Log total errors and warnings across all files
 */
export async function reportSummary(
  errorsByFile: ReturnType<typeof getErrorsByFile>
) {
  const chalk = await chalkImport;

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

  console.log(
    "\n",
    chalk.red(
      `${combinedErrorsAndWarnings.errors} ${pluralize(
        combinedErrorsAndWarnings.errors,
        "error",
        "errors"
      )}`
    ),
    chalk.yellow(
      `${combinedErrorsAndWarnings.warnings} ${pluralize(
        combinedErrorsAndWarnings.warnings,
        "warning",
        "warnings"
      )}`
    )
  );

  /**
   * Exit with error code if there are any errors
   */
  if (combinedErrorsAndWarnings.errors > 0) {
    process.exit(1);
  }
}
