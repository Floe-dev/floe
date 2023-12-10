/* eslint-disable no-console -- Need for user output*/
import type { Command } from "commander";
import type { AiLintDiffResponse } from "@floe/types";
import { truncate } from "../../utils/truncate";
import { getRules } from "../../utils/config";
import { api } from "../../utils/api";
import { checkIfValidRoot } from "../../utils/check-if-valid-root";
import {
  getDefaultBranch,
  gitGithubOrGitlabOrgAndRepo,
  getCurrentBranch,
} from "../../utils/git";

const oraImport = import("ora").then((m) => m.default);
const chalkImport = import("chalk").then((m) => m.default);

export function fromDiff(program: Command) {
  program
    .command("diff")
    .description("Validate content from diff")
    .option("--owner <owner>", "Owner of the repository")
    .option("--repo <repo>", "Repository name")
    .option("--base <baseSha>", "Base SHA")
    .option("--head <headSha>", "Head SHA")
    .action(
      async (options: {
        owner?: string;
        repo?: string;
        base?: string;
        head?: string;
      }) => {
        /**
         * Exit if not a valid Floe root
         */
        checkIfValidRoot();

        /**
         * Import ESM modules
         */
        const ora = await oraImport;
        const chalk = await chalkImport;

        const repoAndOwner = gitGithubOrGitlabOrgAndRepo();
        const baseSha = options.base || getDefaultBranch();
        const headSha = options.head || getCurrentBranch();
        const owner = options.owner || repoAndOwner?.owner;
        const repo = options.repo || repoAndOwner?.repo;
        const { rules, rulesets } = getRules();
        let hasOneError = false;

        const rulesetsWithRules = Object.entries(rulesets).map(
          ([key, value]) => {
            return {
              name: key,
              ...value,
              rules: Object.entries(value.rules).map(([ruleKey, ruleValue]) => {
                const description = rules[ruleKey];

                if (!description) {
                  throw new Error(
                    `Invalid config. Rule "${ruleKey}" does not exist in "rules".`
                  );
                }

                return {
                  code: ruleKey,
                  level: ruleValue,
                  description,
                };
              }),
            };
          }
        );

        try {
          const spinner = ora("Validating content...").start();

          const response = await api.get<AiLintDiffResponse>(
            "/api/v1/ai-lint-diff",
            {
              params: {
                owner,
                repo,
                baseSha,
                headSha,
                rulesets: rulesetsWithRules,
              },
            }
          );

          spinner.stop();

          if (response.data?.cached) {
            console.log(chalk.dim("Validated from cache"));
          }

          if (response.data?.files.length === 0) {
            console.log(
              chalk.dim("No violations found for current selection\n")
            );
          }

          response.data?.files.forEach((diff) => {
            if (diff.violations.length > 0) {
              const rootErrorLevel = diff.violations.some(
                (v) => v.level === "error"
              )
                ? "error"
                : "warn";

              if (rootErrorLevel === "error") {
                hasOneError = true;
                console.log(
                  chalk.white.bgRed(" ERROR "),
                  `📂 ${diff.filename}\n`
                );
              } else {
                console.log(
                  chalk.white.bgYellow(" WARN "),
                  `📂 ${diff.filename}\n`
                );
              }

              diff.violations.forEach((violation) => {
                const icon = violation.level === "error" ? "❌" : "⚠️";

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
                    `💡 ${violation.fix ? violation.fix : "No fix available"}`
                  ),
                  "\n"
                );
              });

              return;
            }

            console.log(chalk.white.bgGreen(" PASS "), `📂 ${diff.filename}`);
          });
        } catch (error) {
          console.error(error);
          process.exit(1);
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The rule is incorrect :/
        if (hasOneError) {
          console.log(`\n${chalk.red("Validation failed.")}`);
          process.exit(1);
        }

        console.log(`\n${chalk.green("Validation passed.")}`);
      }
    );
}
