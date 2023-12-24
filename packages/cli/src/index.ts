#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import { init } from "./commands/init";
// import { aiCreate } from "./commands/ai-create";
import { review } from "./commands/review";

const program = new Command();

/**
 * COMMANDS
 */
init(program);
// aiCreate(program);
review(program);

/**
 * PARSE
 */
program.parse();
