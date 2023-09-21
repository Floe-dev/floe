import chalk from "chalk";
import { Command } from "commander";
import degit from "degit";
import figlet from "figlet";
import gradient from "gradient-string";
import { createSpinner } from "nanospinner";
import confirm from "@inquirer/confirm";
import select from "@inquirer/select";
import fs from "fs";
import { sleep } from "../utils/sleep.js";

export function init(program: Command) {
  program
    .command("init")
    .description("Setup a new Floe data source")
    .action(async () => {
      /**
       * Check if user is in a git repository
       */
      const gitDir = fs.existsSync(".git");

      if (!gitDir) {
        console.log(
          chalk.red(
            "No git repository was found. Make sure you are in the root of your Floe data source."
          )
        );
        return;
      }

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
            description:
              "Scaffold a data source with docs, changelog, and blog",
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

        // const pkgPath = path.dirname(resolve("@floe/markdoc/package.json"));
        // console.log(111111, pkgPath);

        // const defaultMarkdocConfig = {
        //   id: "Floe data source",
        //   path: ".floe",
        //   schema: {
        //     path: pkgPath + "/dist/config.js",
        //     type: "esm",
        //     property: "default",
        //     watch: true,
        //   },
        //   routing: {
        //     frontmatter: "route",
        //   },
        // };

        // const defaultConfig = `${JSON.stringify(
        //   defaultMarkdocConfig,
        //   null,
        //   2
        // )}\n`;
        // writeFileSync(resolve(".", "markdoc.config.json"), defaultConfig);

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
          "🖇️  Connect your data source in the Floe dashboard https://app.floe.dev"
        );
        console.log("✍️  Start writing content!");
      });
    });
}
