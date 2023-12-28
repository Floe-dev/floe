import type { Config } from "./types";
import { version } from "./package.json";

export const defaultConfig: Config = {
  $schema: `https://unpkg.com/@floe/config@${version}/schema.json`,
  reviews: {
    maxFileEvaluations: 5,
    maxDiffEvaluations: 20,
  },
  rulesets: {},
} as const;

export { validate } from "./validate";
export type { Config } from "./types";
