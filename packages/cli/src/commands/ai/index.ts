import { Command } from "commander";
import { generate } from "./generate";

export function ai(program: Command) {
  program
    .command("ai")
    .argument("<action>", "branch to generate content from")
    .description("AI commands")
    .action(async (action: "generate") => {
      console.log("Action:", action);
      if (action === "generate") {
        return generate();
      }

      // Exit and show help
      program.help();
    });
}
