import { version } from "./package.json";

export const defaultConfig = {
  $schema: `https://unpkg.com/@floe/config@${version}/schema.json`,
  sections: [],
} as const;

export { validate } from "./validate";
