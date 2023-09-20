#!/usr/bin/env node
import { Command } from "commander";
const program = new Command();
// Add actions onto the CLI
program
    .arguments("<name>")
    .action((message) => {
    console.log("Hello " + message);
})
    .description("Test the CLI");
// Execute the CLI with given args
program.parse(process.argv);
