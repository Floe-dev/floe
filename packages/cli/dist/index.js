#!/usr/bin/env node
import fs from "fs";
import degit from "degit";
import { Command } from "commander";
import select from "@inquirer/select";
import confirm from "@inquirer/confirm";
import { createSpinner } from "nanospinner";
const program = new Command();
/**
 * Sleep function
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
program
    .command("init")
    .description("Setup a new Floe data source")
    .action(async () => {
    /**
     * Check if directory already exists
     */
    if (fs.existsSync(".floe")) {
        const answer = await confirm({
            message: "A `.floe` directory was detected. The contents will be overwritten. Do you want to continue?",
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
    const githubRepoURL = answer === "all"
        ? "Floe-dev/floe-sample-data"
        : "floe-dev/floe-starter-barebones";
    const emitter = degit(`github:${githubRepoURL}`, {
        force: true,
    });
    try {
        await emitter.clone(`./`);
        spinner.success({
            text: "Template downloaded!",
            mark: "✔",
        });
    }
    catch (e) {
        spinner.error({
            text: "Ruh roh there was a problem downloading the template.",
            mark: "✖",
        });
    }
});
program.parse();
