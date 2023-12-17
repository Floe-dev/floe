import { execSync } from "node:child_process";
import type { Command } from "commander";
import { api } from "@floe/lib/axios";
import type { AiLintDiffResponse } from "@floe/requests/at-lint-diff/_get";
import { getRules } from "@floe/lib/rules";
import { parseDiff } from "@floe/lib/diff-parser";
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
    .action(async (options: { repo?: string }, diffArg?: string) => {
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
        diffArg ?? options.repo ? `${baseSha}...${headSha}` : "HEAD";

      // Exec git diff and parse output
      const output = execSync(`git --no-pager diff ${basehead}`).toString();
      const parsedDiff = parseDiff(output);

      console.log(11111, parsedDiff[1].hunks[0].changes);
    });
}
