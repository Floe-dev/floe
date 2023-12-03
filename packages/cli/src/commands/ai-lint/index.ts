import type { Command } from "commander";
import { fromDiff } from "./from-diff";

export function aiLint(program: Command) {
  const validateProgram = program
    .command("ai-lint")
    .description("Lint content");

  fromDiff(validateProgram);
}
