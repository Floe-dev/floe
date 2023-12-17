#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import { init } from "./commands/init";
// import { aiCreate } from "./commands/ai-create";
// import { aiLint } from "./commands/ai-lint";
import { review } from "./commands/review";

const program = new Command();

/**
 * COMMANDS
 */
init(program);
// aiCreate(program);
// aiLint(program);
review(program);

/**
 * PARSE
 */
program.parse();
