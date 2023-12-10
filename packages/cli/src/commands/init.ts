import fs from "node:fs";
import { resolve } from "node:path";
import type { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import { defaultConfig } from "@floe/config";
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
      fs.cpSync(`${__dirname}/default-files/`, ".floe/templates", {
        recursive: true,
      });

      /**
       * Can augment default config with rules, rulesets, etc. based on user input
       */
      const config = {
        ...defaultConfig,
      };

      console.log(11111, config);

      fs.writeFileSync(
        resolve(".floe/config.json"),
        JSON.stringify(config, null, 2)
      );
    });
}
