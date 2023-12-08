/* eslint-disable no-console -- Need for user output*/
import type { Command } from "commander";
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

        console.log(11111);

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

          const response = await api.get("/api/v1/ai-lint-diff", {
            params: {
              owner,
              repo,
              baseSha,
              headSha,
              rulesets: rulesetsWithRules,
            },
          });

          spinner.succeed("Validation complete!");

          response.data.forEach((diff) => {
            if (diff.violations.length > 0) {
              const rootErrorLevel = diff.violations.some(
                (v) => v.level === "error"
              )
                ? "error"
                : "warn";

              if (rootErrorLevel === "error") {
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

              diff.violations.forEach((violation: any) => {
                const icon = violation.level === "error" ? "❌" : "⚠️";
                const textColor =
                  violation.level === "error" ? chalk.red : chalk.yellow;

                /**
                 * Log violation code and description
                 */
                console.log(
                  chalk.bold(`${icon}  ${violation.code}:`),
                  violation.description
                );

                /**
                 * Log substring in context
                 */
                console.log(
                  chalk.dim(
                    truncate(
                      violation.lineContent.substring(0, violation.columns[0]),
                      40,
                      true
                    )
                  ) +
                    textColor(violation.substring) +
                    chalk.dim(
                      truncate(
                        violation.lineContent.substring(violation.columns[1]),
                        40
                      )
                    ),
                  "\n"
                );

                /**
                 * Log suggestion
                 */
                console.log(
                  chalk.italic.dim(`💡 ${violation.suggestion}`),
                  "\n"
                );
              });

              return;
            }

            console.log(
              chalk.white.bgGreen(" PASS "),
              `📂 ${diff.filename}, ${JSON.stringify(diff.location)}`
            );
          });

          return response.data;
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      }
    );
}
