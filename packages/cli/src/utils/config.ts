import fs from "node:fs";
import path from "node:path";

export const getRules = () => {
  const config = fs.readFileSync(
    path.join(process.cwd(), ".floe/config.json"),
    "utf-8"
  );

  const { rules, rulesets } = JSON.parse(config);

  return { rules, rulesets };
};
