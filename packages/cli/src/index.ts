#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import { init } from "./commands/init";
import { aiCreate } from "./commands/ai-create";
import { aiLint } from "./commands/ai-lint";

const program = new Command();

/**
 * COMMANDS
 */
init(program);
aiCreate(program);
aiLint(program);

/**
 * PARSE
 */
program.parse();
