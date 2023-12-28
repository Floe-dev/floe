import fs from "node:fs";
import path from "node:path";
import type { Config } from "@floe/config";

export function getFloeConfig() {
  try {
    const config = fs.readFileSync(
      path.join(process.cwd(), ".floe/config.json"),
      "utf-8"
    );

    return JSON.parse(config) as Config;
  } catch (e) {
    console.log(`Invalid config. Please run "floe init" to initialize Floe.`);

    process.exit(1);
  }
}
