#!/usr/bin/env node

import { Command } from "commander";

import { init } from "./commands/init.js";
import { login } from "./commands/login.js";
import { add } from "./commands/add.js";
import { validate } from "./commands/validate.js";

const program = new Command();

/**
 * COMMANDS
 */
add(program);
init(program);
login(program);
validate(program);

/**
 * PARSE
 */
program.parse();
