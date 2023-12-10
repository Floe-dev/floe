import { version } from "./package.json";

export const defaultConfig = {
  $schema: `https://unpkg.com/@floe/config@${version}/schema.json`,
  rules: {
    "overly-enthusiastic": "Make every sentence end with an exclamation mark!",
  },
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
