import fs from "node:fs";
import path from "node:path";
import type { Config } from "@floe/config";

export const getRules = () => {
  const config = fs.readFileSync(
    path.join(process.cwd(), ".floe/config.json"),
    "utf-8"
  );

  const { rules, rulesets } = JSON.parse(config) as Config;

  return { rules, rulesets };
};
