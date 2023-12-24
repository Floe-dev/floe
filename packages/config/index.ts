import type { Config } from "./types";
import { version } from "./package.json";

export const defaultConfig: Config = {
  $schema: `https://unpkg.com/@floe/config@${version}/schema.json`,
  rulesets: {
    docs: {
      include: ["**/*.md"],
      rules: {
        "overly-enthusiastic": "error",
      },
    },
  },
} as const;

export { validate } from "./validate";
export type { Config } from "./types";
