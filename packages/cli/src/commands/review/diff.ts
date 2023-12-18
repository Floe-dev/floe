import type { Command } from "commander";
import { getRules } from "@floe/lib/rules";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import { createReview } from "@floe/requests/review/_post";
import simpleGit from "simple-git";
import { minimatch } from "minimatch";
import { checkIfValidRoot } from "../../utils/check-if-valid-root";
import { getDefaultBranch, getCurrentBranch } from "../../utils/git";

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
      const filesToEvaluate = files
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

      filesToEvaluate.forEach((file) => {
        file.matchingRulesets.forEach((ruleset) => {
          ruleset.rules.forEach((rule) => {
            file.hunks.forEach(async (hunk) => {
              const review = await createReview({
                path: file.path,
                content: hunk.content,
                startLine: hunk.lineStart,
                rule,
              }).catch((e) => {
                process.exit(1);
              });

              console.log(3333333, review.data?.violations);
            });
          });
        });
      });
    });
}
