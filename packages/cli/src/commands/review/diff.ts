import type { Command } from "commander";
import { getRules } from "@floe/lib/rules";
import { pluralize } from "@floe/lib/pluralize";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import { createReview } from "@floe/requests/review/_post";
import simpleGit from "simple-git";
import { minimatch } from "minimatch";
import { truncate } from "../../utils/truncate";
import { checkIfValidRoot } from "../../utils/check-if-valid-root";
import { getDefaultBranch, getCurrentBranch } from "../../utils/git";
import { logAxiosError } from "../../utils/logging";

const oraImport = import("ora").then((m) => m.default);
const chalkImport = import("chalk").then((m) => m.default);

export function diff(program: Command) {
  program
    .command("diff")
    .description("Validate content from diff")
    .option("--repo <repo>", "Repository owner and name eg. owner/name")
    .argument("[diff]", "Diff")
    // .option("--base <baseSha>", "Base SHA")
    // .option("--head <headSha>", "Head SHA")
    .action(async (diffArg?: string, options: { repo?: string } = {}) => {
      /**
       * Exit if not a valid Floe root
       */
      checkIfValidRoot();

      /**
       * Import ESM modules
       */
      const ora = await oraImport;
      const chalk = await chalkImport;

      const baseSha = getDefaultBranch();
      const headSha = getCurrentBranch();

      const basehead =
        diffArg ?? options.repo ? `${baseSha}...${headSha}` : "HEAD~1";

      // Exec git diff and parse output
      let diffOutput: string;

      try {
        diffOutput = await simpleGit().diff([basehead]);
      } catch (error) {
        process.exit(1);
      }

      /**
       * Parse git diff to more useable format
       */
      const files = parseDiffToFileHunks(diffOutput);

      /**
       * Get rules from Floe config
       */
      const rules = getRules();

      /**
       * We only want to evaluate diffs that are included in a ruleset
       */
      const filesMatchingRulesets = files
        .map((file) => {
          const matchingRulesets = rules.rulesetsWithRules.filter((ruleset) => {
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

      /**
       * We want to evaluate each hunk against each rule. This can create a lot
       * of requests! But we can do this in parallel, and each request is
       * cached.
       */
      const ruleHunksByFile = filesMatchingRulesets.map((file) => ({
        path: file.path,
        evaluations: file.matchingRulesets.flatMap((ruleset) =>
          ruleset.rules.flatMap((rule) =>
            file.hunks.map((hunk) => ({ rule, hunk }))
          )
        ),
      }));

      const allReviews = await Promise.all(
        ruleHunksByFile.map(async ({ path, evaluations }) => {
          const spinner = ora(`📂 ${path}\n`).start();

          const evaluationsResponse = await Promise.all(
            evaluations.map(async ({ rule, hunk }) => {
              const review = await createReview({
                path,
                content: hunk.content,
                startLine: hunk.lineStart,
                rule,
              }).catch(async (e) => {
                await logAxiosError(e);

                process.exit(1);
              });

              return {
                hunk,
                rule,
                review: review.data,
                cached: review.data?.cached,
              };
            })
          );

          const warningsAndErrors = evaluationsResponse.reduce(
            (acc, { review }) => {
              if (!review) {
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

          let errorLevel = {
            symbol: chalk.white.bgGreen("  PASS  "),
            level: "pass",
          };

          if (warningsAndErrors.warnings > 0) {
            errorLevel = {
              symbol: chalk.white.bgYellow("  WARN  "),
              level: "warn",
            };
          }

          if (warningsAndErrors.errors > 0) {
            errorLevel = {
              symbol: chalk.white.bgRed("  FAIL  "),
              level: "fail",
            };
          }

          /**
           * Show file status
           */
          spinner.stopAndPersist({
            symbol: errorLevel.symbol,
            text: `📂 ${path}`,
          });

          if (
            warningsAndErrors.errors === 0 &&
            warningsAndErrors.warnings === 0
          ) {
            console.log(
              chalk.dim("No violations found for current selection\n")
            );
          }

          /**
           * Log violations
           */
          evaluationsResponse
            .flatMap((e) => e.review?.violations)
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
                violation.errorDescription
              );

              /**
               * Log lines with violations
               */
              console.log(
                chalk.dim.strikethrough(truncate(violation.lineContent, 100))
              );

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

          return warningsAndErrors;
        })
      );

      const combinedErrorsAndWarnings = allReviews.reduce(
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

      if (combinedErrorsAndWarnings.errors > 0) {
        process.exit(1);
      }
    });
}
