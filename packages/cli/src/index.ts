#!/usr/bin/env node

import { Command } from "commander";

import { init } from "./commands/init.js";
import { validate } from "./commands/validate.js";

const program = new Command();

/**
 * COMMANDS
 */
init(program);
validate(program);

/**
 * PARSE
 */
program.parse();
