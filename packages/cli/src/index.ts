#!/usr/bin/env node

import { Command } from "commander";

import { init } from "./commands/init.js";
import { login } from "./commands/login.js";
import { validate } from "./commands/validate.js";

const program = new Command();

/**
 * COMMANDS
 */
init(program);
validate(program);
login(program);

/**
 * PARSE
 */
program.parse();
