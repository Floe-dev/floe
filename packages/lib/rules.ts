import fs from "node:fs";
import path from "node:path";
import type { Config } from "@floe/config";

export const getRules = () => {
  const config = fs.readFileSync(
    path.join(process.cwd(), ".floe/config.json"),
    "utf-8"
  );

  const { rules, rulesets } = JSON.parse(config) as Config;

  const rulesetsWithRules = Object.entries(rulesets).map(([key, value]) => {
    return {
      name: key,
      ...value,
      rules: Object.entries(value.rules).map(([ruleKey, ruleValue]) => {
        const description = rules[ruleKey];

        if (!description) {
          throw new Error(
            `Invalid config. Rule "${ruleKey}" does not exist in "rules".`
          );
        }

        return {
          code: ruleKey,
          level: ruleValue,
          description,
        };
      }),
    };
  });

  return { rules, rulesets, rulesetsWithRules };
};
