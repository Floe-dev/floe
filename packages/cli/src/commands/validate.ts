import { Command } from "commander";
import { readFileSync } from "fs";
import { glob } from "glob";
import { createSpinner } from "nanospinner";
import { validate as validateMarkdoc } from "@floe/markdoc";
import { validate as validateSchema } from "@floe/config";
import fs from "fs";
import axios from "axios";
import { sleep } from "../utils/sleep.js";
const chalkImport = import("chalk").then((m) => m.default);

export function validate(program: Command) {
  program
    .command("validate")
    .description("Validate Markdoc")
    .action(async () => {
      const chalk = await chalkImport;
      const spinner1 = createSpinner("Validating config...").start();
      const config = JSON.parse(fs.readFileSync(".floe/config.json", "utf-8"));
      const schemaURL = config.$schema;

      const schema = await axios.get(schemaURL).catch((e) => {
        spinner1.error({
          text: chalk.red("Could not fetch schema"),
          mark: chalk.red("✖"),
        });

        process.exit(1);
      });

      if (!config) {
        throw new Error("No config found");
      }

      const { valid, errors } = validateSchema(config);

      if (!valid) {
        console.log(chalk.red("Config file is invalid"));
        errors?.forEach((e) => console.error(e));

        return;
      }

      await sleep(1000);

      spinner1.success({
        text: chalk.green("Config is valid"),
        mark: chalk.green("✔"),
      });

      const spinner2 = createSpinner("Validating files...").start();

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

      await sleep(1000);

      /**
       * Get contents of each file
       */
      const mdValidList = files
        .map((file) => {
          const contents = readFileSync(file, "utf-8");
          const result = validateMarkdoc(contents);

          if (result.length === 0) {
            return undefined;
          }

          return result;
        })
        .filter((f) => !!f);

      if (!mdValidList.length) {
        spinner2.success({
          text: chalk.green("Markdown is valid"),
          mark: chalk.green("✔"),
        });

        return;
      }

      spinner2.error({
        text: chalk.red("Invalid markdown:"),
        mark: chalk.red("✖"),
      });

      mdValidList.forEach((result) => {
        console.log(chalk.red(`✖ ${JSON.stringify(result)}`));
      });
    });
}
