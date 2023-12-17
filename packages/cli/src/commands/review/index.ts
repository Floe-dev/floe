import type { Command } from "commander";
import { diff } from "./diff";

export function review(program: Command) {
  const validateProgram = program
    .command("review")
    .description("Review content");

  diff(validateProgram);
}
