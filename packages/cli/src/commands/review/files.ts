import fs from "node:fs";
import type { Command } from "commander";
import { getRulesets } from "@floe/lib/rules";
import { glob } from "glob";
import { minimatch } from "minimatch";
import { checkIfValidRoot } from "../../utils/check-if-valid-root";
import { logAxiosError } from "../../utils/logging";
import {
  getErrorsByFile,
  getReviewsByFile,
  logViolations,
  reportSummary,
} from "./lib";

const oraImport = import("ora").then((m) => m.default);
const chalkImport = import("chalk").then((m) => m.default);

export function files(program: Command) {
  program
    .command("files")
    .description("Validate content from files")
    .argument("[files...]", "Files")
    .option("--ignore <ignore...>", "Ignore pattern")
    .action(
      async (filesArg?: string[], options: { ignore?: string[] } = {}) => {
        /**
         * Exit if not a valid Floe root
         */
        checkIfValidRoot();

        /**
         * Import ESM modules
         */
        const ora = await oraImport;
        const chalk = await chalkImport;

        const filesPattern = filesArg?.length ? filesArg : ["**/*"];
        const ignore = options.ignore?.length ? options.ignore : [];

        const f = await glob(filesPattern, { ignore, nodir: true });

        /**
         * Get rules from Floe config
         */
        const rulesets = getRulesets();

        /**
         * We only want to evaluate diffs that are included in a ruleset
         */
        const filesMatchingRulesets = f
          .map((file) => {
            const matchingRulesets = rulesets.filter((ruleset) => {
              return ruleset.include.some((pattern) => {
                return minimatch(file, pattern);
              });
            });

            return {
              path: file,
              matchingRulesets,
            };
          })
          .filter(({ matchingRulesets }) => matchingRulesets.length > 0);

        if (filesMatchingRulesets.length === 0) {
          console.log(chalk.dim("No matching files to review\n"));

          process.exit(0);
        }

        const filesWithContent = filesMatchingRulesets.map((file) => {
          const content = fs.readFileSync(file.path, "utf8");

          return {
            ...file,
            content,
          };
        });

        /**
         * We want to evaluate each hunk against each rule. This can create a lot
         * of requests! But we can do this in parallel, and each request is
         * cached.
         */
        const evalutationsByFile = filesWithContent.map((file) => ({
          path: file.path,
          evaluations: file.matchingRulesets.flatMap((ruleset) =>
            ruleset.rules.flatMap((rule) => ({
              rule,
              // A hunk is an entire file when using 'review files'. This means that startLine is always 1.
              hunk: {
                startLine: 1,
                content: file.content,
              },
            }))
          ),
        }));

        /**
         * Show loading spinner
         */
        const spinner = ora("Validating content...").start();

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

        const errorsByFile = getErrorsByFile(reviewsByFile);

        await logViolations(errorsByFile);
        await reportSummary(errorsByFile);
      }
    );
}
