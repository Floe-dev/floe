#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import { version } from "../package.json";
import { init } from "./commands/init";
import { review } from "./commands/review";

const program = new Command();

/**
 * COMMANDS
 */
init(program);
review(program);

// Get version from npm package
program.version(version);

/**
 * PARSE
 */
program.parse();
