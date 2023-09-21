import chalk from "chalk";
import { Command } from "commander";
import { readFileSync } from "fs";
import { glob } from "glob";
import { createSpinner } from "nanospinner";
import { validate as markdocValidate } from "@floe/markdoc";
import { sleep } from "../utils/sleep.js";

export function validate(program: Command) {
  program
    .command("validate")
    .description("Validate a Floe data")
    .action(async () => {
      console.log(chalk.bold("Validating files..."));

      const spinner = createSpinner("Validating files...").start();
      const files = await glob(".floe/**/*.{md,mdoc}");

      if (files.length === 0) {
        console.log(
          chalk.red(
            "No files were found. Make sure you are in the root of your Floe data source."
          )
        );
        return;
      }

      await sleep(2000);

      spinner.stop();

      /**
       * Get contents of each file
       */
      files.forEach(async (file) => {
        const contents = readFileSync(file, "utf-8");
        const result = markdocValidate(contents);

        if (result.length === 0) {
          console.log(chalk.green(`✔ ${file}`));
          return;
        }

        console.log(chalk.red(`✖ ${file}`));
        console.log(result);
      });
    });
}
