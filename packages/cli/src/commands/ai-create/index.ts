import type { Command } from "commander";
import { fromDiff } from "./from-diff";

export function aiCreate(program: Command) {
  const generateProgram = program
    .command("ai-create")
    .description("Create content");

  fromDiff(generateProgram);
}
