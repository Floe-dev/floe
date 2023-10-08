import chalk from "chalk";
import { Command } from "commander";
import { readFileSync } from "fs";
import { glob } from "glob";
import { createSpinner } from "nanospinner";
import { validate as validateMarkdoc } from "@floe/markdoc";
import { validate as validateSchema } from "@floe/config";
import fs from "fs";
import { sleep } from "../utils/sleep.js";

export function validate(program: Command) {
  program
    .command("validate")
    .description("Validate Markdoc")
    .action(async () => {
      console.log(chalk.bold("Validating schema..."));
      const schema = JSON.parse(fs.readFileSync(".floe/config.json", "utf-8"));

      console.log(schema);

      if (!schema) {
        throw new Error("No schema found");
      }

      console.log(3333, validateSchema(schema));

      await sleep(2000);

      console.log(chalk.bold("Validating files..."));

      // TODO: Only use md files defined in schema
      const files = await glob(["*.md", "**/*.md"]);

      if (files.length === 0) {
        console.log(
          chalk.red(
            "No files were found. Make sure you are in the root of your Floe data source."
          )
        );

        return;
      }

      const spinner = createSpinner("Validating files...").start();

      await sleep(2000);

      spinner.stop();

      /**
       * Get contents of each file
       */
      files.forEach(async (file) => {
        const contents = readFileSync(file, "utf-8");
        const result = validateMarkdoc(contents);

        if (result.length === 0) {
          console.log(chalk.green(`✔ ${file}`));
          return;
        }

        console.log(chalk.red(`✖ ${file}`));
        console.log(result);
      });
    });
}
