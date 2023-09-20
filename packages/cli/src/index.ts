#!/usr/bin/env node

import fs from "fs";
import degit from "degit";
import figlet from "figlet";
import { Command } from "commander";
import select from "@inquirer/select";
import confirm from "@inquirer/confirm";
import { createSpinner } from "nanospinner";
import gradient from "gradient-string";
import chalk from "chalk";

const program = new Command();

/**
 * Sleep function
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

program
  .command("init")
  .description("Setup a new Floe data source")
  .action(async () => {
    /**
     * Check if directory already exists
     */
    if (fs.existsSync(".floe")) {
      const answer = await confirm({
        message:
          "A `.floe` directory was detected. The contents will be overwritten. Do you want to continue?",
      });

      if (answer === false) {
        return;
      }
    }

    const answer = await select({
      message: "Select a template",
      choices: [
        {
          name: "Docs, changelog, blog (default)",
          value: "all",
          description: "Scaffold a data source with docs, changelog, and blog",
        },
        {
          name: "Barebones",
          value: "none",
          description: "Scaffold a data source with just the .floe config",
        },
      ],
    });

    const spinner = createSpinner("Downloading template...").start();
    await sleep(2000);

    const githubRepoURL =
      answer === "all"
        ? "Floe-dev/floe-sample-data"
        : "floe-dev/floe-starter-barebones";

    const emitter = degit(`github:${githubRepoURL}`, {
      force: true,
    });

    try {
      await emitter.clone(`./`);
      spinner.success({
        text: chalk.green("Template downloaded!"),
        mark: chalk.green("✔"),
      });
    } catch (e) {
      spinner.error({
        text: "Ruh roh there was a problem downloading the template.",
        mark: "✖",
      });
    }

    figlet("success", (err, data) => {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(gradient.pastel.multiline(data));

      console.log(
        chalk.green("Your repository is configured for Floe! 🎉 \n\n")
      );
      console.log(chalk.bold("Next steps:"));
      console.log("📡  Push your changes to GitHub");
      console.log(
        "🖇️  If you haven't already, connect your data source in the Floe dashboard https://app.floe.dev"
      );
      console.log("✍️  Start writing content!");
    });
  });

program.parse();
