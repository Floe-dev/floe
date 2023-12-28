import type { Command } from "commander";
import { diff } from "./diff";
import { files } from "./files";

export function review(program: Command) {
  const validateProgram = program
    .command("review")
    .description("Review content");

  diff(validateProgram);
  files(validateProgram);
}
