import fs from "node:fs";
import { resolve } from "node:path";
import type { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import type { Config } from "@floe/config";
import { defaultConfig } from "@floe/config";
import { checkIfValidRoot } from "@floe/lib/check-if-valid-root";

const chalkImport = import("chalk").then((m) => m.default);

export function init(program: Command) {
  program
    .command("init")
    .description("Initialize Floe")
    .action(async () => {
      /**
       * Exit if not a valid git root
       */
      checkIfValidRoot(true);

      const chalk = await chalkImport;

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
      // fs.cpSync(`${__dirname}/default-files/templates`, ".floe/templates", {
      //   recursive: true,
      // });

      fs.cpSync(`${__dirname}/default-files/rules`, ".floe/rules", {
        recursive: true,
      });

      /**
       * Can augment default config with rules, rulesets, etc. based on user input
       */
      const config: Config = {
        ...defaultConfig,
        rulesets: {
          docs: {
            include: ["**/*.md", "**/*.mdx"],
            rules: {
              "spelling-and-grammar": "warn",
            },
          },
        },
      };

      fs.writeFileSync(
        resolve(".floe/config.json"),
        JSON.stringify(config, null, 2)
      );

      console.log(chalk.green("✔ Floe initialized successfully!"));
    });
}
