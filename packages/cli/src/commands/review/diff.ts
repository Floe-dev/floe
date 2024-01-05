import type { Command } from "commander";
import { getRulesets } from "@floe/lib/rules";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import simpleGit from "simple-git";
import { minimatch } from "minimatch";
import { getFloeConfig } from "@floe/lib/get-floe-config";
import { checkIfValidRoot } from "@floe/lib/check-if-valid-root";
// import { getDefaultBranch, getCurrentBranch } from "../../utils/git";
import { logAxiosError } from "../../utils/logging";
import {
  checkIfUnderEvaluationLimit,
  getErrorsByFile,
  getReviewsByFile,
  logViolations,
  reportSummary,
} from "./lib";

const oraImport = import("ora").then((m) => m.default);
const chalkImport = import("chalk").then((m) => m.default);

export function diff(program: Command) {
  program
    .command("diff")
    .description("Validate content from diff")
    .argument("[diff]", "Diff")
    .option("--fix", "Fix violations")
    // .option("--repo <repo>", "Repository owner and name eg. owner/name")
    .action(async (diffArg?: string, options: { fix?: boolean } = {}) => {
      /**
       * Exit if not a valid Floe root
       */
      checkIfValidRoot();

      /**
       * Import ESM modules
       */
      const ora = await oraImport;
      const chalk = await chalkImport;

      const config = getFloeConfig();

      // const baseSha = getDefaultBranch();
      // const headSha = getCurrentBranch();

      const basehead =
        // diffArg ?? (options.repo ? `${baseSha}...${headSha}` : "HEAD");
        diffArg ?? "HEAD";

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

      await checkIfUnderEvaluationLimit(
        evalutationsByFile,
        Number(config.reviews?.maxFileEvaluations ?? 5)
      );

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

      await logViolations(errorsByFile, options.fix);
      await reportSummary(errorsByFile);
    });
}
