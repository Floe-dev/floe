import type { Command } from "commander";
import { getRulesets } from "@floe/lib/rules";
import { pluralize } from "@floe/lib/pluralize";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import simpleGit from "simple-git";
import { minimatch } from "minimatch";
import { truncate } from "../../utils/truncate";
import { checkIfValidRoot } from "../../utils/check-if-valid-root";
import { getDefaultBranch, getCurrentBranch } from "../../utils/git";
import { logAxiosError } from "../../utils/logging";
import { getReviewsByFile } from "./lib";

const oraImport = import("ora").then((m) => m.default);
const chalkImport = import("chalk").then((m) => m.default);

export function diff(program: Command) {
  program
    .command("diff")
    .description("Validate content from diff")
    .argument("[diff]", "Diff")
    // .option("--repo <repo>", "Repository owner and name eg. owner/name")
    .action(
      async (
        diffArg?: string
        // options: { repo?: string } = {}
      ) => {
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
          // diffArg ?? (options.repo ? `${baseSha}...${headSha}` : "HEAD");
          diffArg ?? `${baseSha}...${headSha}`;

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

        /**
         * Show loading spinner
         */
        const spinner = ora("Validating content...").start();

        /**
         * Generate a review for each hunk and rule.
         * Output is an array of reviews grouped by file.
         */
        const reviewsByFile = await getReviewsByFile(evalutationsByFile).catch(
          async (e) => {
            spinner.stop();
            await logAxiosError(e);
            process.exit(1);
          }
        );

        /**
         * Rules fetched. We can stop the spinner.
         */
        spinner.stop();

        /**
         * Generate a count of total errors and warnings for each file
         */
        const errorsByFile = reviewsByFile.map(
          ({ path, evaluationsResponse }) => {
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
          }
        );

        /**
         * Log errors and warnings
         */
        errorsByFile.forEach(
          ({ path, errors, warnings, evaluationsResponse }) => {
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
              console.log(
                chalk.dim("No violations found for current selection\n")
              );
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
                console.log(
                  chalk.dim.strikethrough(truncate(violation.content, 100))
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
          }
        );

        /**
         * Log total errors and warnings across all files
         */
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
    );
}
