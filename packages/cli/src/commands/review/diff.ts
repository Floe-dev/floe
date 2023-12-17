import { execSync } from "node:child_process";
import type { Command } from "commander";
import { getRules } from "@floe/lib/rules";
import { parseDiffToFileHunks } from "@floe/lib/diff-parser";
import { createReview } from "@floe/requests/review/_post";
import simpleGit from "simple-git";
import { truncate } from "../../utils/truncate";
import { logError } from "../../utils/logging";
import { checkIfValidRoot } from "../../utils/check-if-valid-root";
import {
  getDefaultBranch,
  gitGithubOrGitlabOrgAndRepo,
  getCurrentBranch,
} from "../../utils/git";

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
      const parsedDiff = parseDiffToFileHunks(diffOutput);

      const rules = getRules();

      // TODO: Filter out rulesets that don't apply to the diff

      rules.rulesetsWithRules.forEach((ruleset) => {
        ruleset.rules.forEach((rule) => {
          parsedDiff.forEach((file) => {
            file.hunks.forEach(async (hunk) => {
              const review = await createReview({
                path: file.path,
                content: hunk.content,
                startLine: hunk.lineStart,
                rule,
              }).catch((e) => {
                console.log(444444, e.message);
                process.exit(1);
              });

              console.log(3333333, review.data?.violations);
            });
          });
        });
      });
    });
}
