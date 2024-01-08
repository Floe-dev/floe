import { pluralize } from "@floe/lib/pluralize";
import { diffWords } from "diff";
import { confirm } from "@inquirer/prompts";
import type { ErrorsByFile } from "@floe/features/reviews";
import { updateLines } from "../../utils/lines-update";

const chalkImport = import("chalk").then((m) => m.default);

/**
 * Log errors and warnings
 */
export async function logViolations(
  errorsByFile: ErrorsByFile,
  fixViolations = false
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
              `${icon} ${violation.code} @@${violation.startLine},${
                violation.endLine
              }${violation.cached ? " (cache)" : ""}:`
            )
          );

          if (!violation.suggestedFix) {
            console.log("➖", chalk.dim(violation.content));
            console.log("➕", "No fix available");
            console.log();

            return [...accumulator2];
          }

          const diff = diffWords(violation.content, violation.suggestedFix);

          let consoleStrAdded = "";
          let consoleStrRemoved = "";

          diff.forEach((part) => {
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
          console.log();

          if (fixViolations) {
            const answer = await confirm({ message: "Accept change?" });

            /**
             * Write to file
             */
            if (answer) {
              updateLines(
                path,
                violation.startLine,
                violation.endLine,
                violation.suggestedFix
              );
            }

            return [...accumulator2, answer];
          }

          return [...accumulator2];
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
export async function reportSummary(errorsByFile: ErrorsByFile) {
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

  const tokenCount = errorsByFile.reduce(
    (acc, { evaluationsResponse }) => {
      const x = evaluationsResponse.reduce(
        (acc2, { review, cached }) => {
          const tokens = review.usage?.total_tokens ?? 0;

          return {
            tokens: acc2.tokens + (cached ? 0 : tokens),
            cached: acc2.cached + (cached ? tokens : 0),
          };
        },
        { tokens: 0, cached: 0 }
      );

      return {
        tokens: acc.tokens + x.tokens,
        cached: acc.cached + x.cached,
      };
    },
    { tokens: 0, cached: 0 }
  );

  console.log(chalk.bold("Summary"));
  console.log(
    chalk.italic(
      `Model: ${errorsByFile[0].evaluationsResponse[0].review.model}`
    )
  );
  console.log(
    chalk.italic(
      `Tokens: ${tokenCount.tokens} (${tokenCount.cached} from cache)`
    )
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
