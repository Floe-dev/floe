import fs from "node:fs";
import type { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import { checkIfValidRoot } from "../utils/check-if-valid-root";

export function init(program: Command) {
  program
    .command("init")
    .description("Initialize Floe")
    .action(async () => {
      /**
       * Exit if not a valid git root
       */
      checkIfValidRoot(true);

      if (fs.existsSync(".floe")) {
        const overwriteAnswer = await confirm({
          message:
            "A `.floe` directory was detected. The contents will be overwritten. Do you want to continue?",
        });

        if (!overwriteAnswer) {
          process.exit(0);
        }
      }

      /**
       * TODO: Let user choose which templates to copy
       */
      fs.cpSync(`${__dirname}/default-files/templates/`, ".floe/templates", {
        recursive: true,
      });

      /**
       * Copy the default config file
       */
      fs.cpSync(`${__dirname}/default-files/config.json`, ".floe/config.json");
    });
}
