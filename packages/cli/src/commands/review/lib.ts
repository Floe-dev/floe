import { createReview } from "@floe/requests/review/_post";
import { pluralize } from "@floe/lib/pluralize";
import { truncate } from "../../utils/truncate";

const chalkImport = import("chalk").then((m) => m.default);

/**
 * Generate a review for each hunk and rule.
 * Output is an array of reviews grouped by file.
 */
export async function getReviewsByFile(
  evalutationsByFile: {
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
  }[]
) {
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

  errorsByFile.forEach(({ path, errors, warnings, evaluationsResponse }) => {
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
    evaluationsResponse
      .flatMap((e) => e.review.violations)
      .forEach((violation) => {
        if (!violation) {
          return;
        }

        const icon = violation.level === "error" ? "❌" : "⚠️ ";

        /**
         * Log violation code and description
         */
        console.log(
          chalk.bold(
            `${icon} ${violation.code} @@${violation.startLine},${violation.endLine}:`
          ),
          violation.description
        );

        /**
         * Log lines with violations
         */
        console.log(chalk.dim.strikethrough(truncate(violation.content, 100)));

        /**
         * Log suggestion
         */
        console.log(
          chalk.italic(
            `💡 ${
              violation.suggestedFix
                ? violation.suggestedFix
                : "No fix available"
            }`
          ),
          "\n"
        );
      });
  });
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
