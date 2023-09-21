import chalk from "chalk";
import { Command } from "commander";
import degit from "degit";
import figlet from "figlet";
import gradient from "gradient-string";
import { createSpinner } from "nanospinner";
import confirm from "@inquirer/confirm";
import select from "@inquirer/select";
import checkbox from "@inquirer/checkbox";
import fs from "fs";
import Jimp from "jimp";
import { sleep } from "../utils/sleep.js";
import { blogSample } from "../default-files/sample-blog.js";
import { changelogSample } from "../default-files/sample-changelog.js";
import { docSample } from "../default-files/sample-doc.js";
import { docSample2 } from "../default-files/sample-doc2.js";
import { postSample } from "../default-files/sample-post.js";
import { resolve } from "path";

const templateSamples = {
  blog: blogSample,
  changelog: changelogSample,
  docs: docSample,
  faq: postSample,
  help: postSample,
};

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

      const answer = await checkbox({
        message: "What do you want to use this project for?",
        choices: [
          { name: "📖 Docs", value: "docs" },
          { name: "🚀 Changelog", value: "changelog" },
          { name: "✍️  Blog", value: "blog" },
          { name: "🙋‍♀️ FAQ", value: "faq" },
          { name: "🤝 Help center", value: "help" },
        ] as { name: string; value: keyof typeof templateSamples }[],
      });

      if (!answer.length) {
        console.log(chalk.red("You must select at least one option."));
        return;
      }

      const spinner = createSpinner("Generating sample images...").start();
      await sleep(1000);

      try {
        /**
         * Scaffold images
         */
        fs.mkdirSync(".floe/public", { recursive: true });

        const randomImageUrl = "https://picsum.photos/500/300.jpg";
        const image1 = await Jimp.read(randomImageUrl);

        image1.write(resolve(".floe/public/image1.jpg"));

        const randomImageUrl2 = "https://picsum.photos/500/300.jpg";
        const image2 = await Jimp.read(randomImageUrl2);
        image2.write(resolve(".floe/public/image2.jpg"));

        spinner.update({
          text: "Generating files...",
        });

        /**
         * Scaffold templates
         */
        answer.forEach((item) => {
          const file = templateSamples[item];

          if (item === "docs") {
            fs.mkdirSync(".floe/docs", { recursive: true });
            fs.writeFileSync(resolve(".floe", "docs/index.md"), docSample);
            fs.writeFileSync(
              resolve(".floe", "docs/getting-started.md"),
              docSample2
            );
            return;
          }

          fs.mkdirSync(`.floe/${item}`, { recursive: true });
          fs.writeFileSync(resolve(".floe", `${item}/sample.md`), file);
        });

        await sleep(1500);

        const randomMessages = [
          "Bumbling beebles...",
          "Golfing gophers...",
          "Shining shoes...",
          "Dueling ducks...",
          "Picking pumpkins...",
          "Branding bananas...",
          "Slicing salamis...",
          "Janking jellies...",
        ];

        spinner.update({
          text: randomMessages[
            Math.floor(Math.random() * randomMessages.length)
          ],
        });

        await sleep(1500);

        spinner.success({
          text: chalk.green("Templates created!"),
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
