import type { Command } from "commander";
import { getRules } from "@floe/lib/rules";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import { createReview } from "@floe/requests/review/_post";
import simpleGit from "simple-git";
import { minimatch } from "minimatch";
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

      const spinner = ora("Validating content...").start();

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
      const hunksToEvaluate = filesMatchingRulesets.flatMap((file) =>
        file.matchingRulesets.flatMap((ruleset) =>
          ruleset.rules.flatMap((rule) =>
            file.hunks.map((hunk) => ({ file, rule, hunk }))
          )
        )
      );

      const allReviews = await Promise.all(
        hunksToEvaluate.map(async ({ file, rule, hunk }) => {
          const response = await createReview({
            path: file.path,
            content: hunk.content,
            startLine: hunk.lineStart,
            rule,
          });

          if (response.data?.cached) {
            console.log(chalk.dim("Validated from cache"));
          }

          console.log(3333333, response.data);
        })
      ).catch(async (e) => {
        spinner.stop();
        await logAxiosError(e);
        process.exit(1);
      });

      spinner.stop();
    });
}
