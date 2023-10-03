import { createGenerator } from "ts-json-schema-generator";

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
  path: "./types.ts",
  tsconfig: "./tsconfig.json",
  type: "Config", // Or <type-name> if you want to generate schema for that one type only
};

export const schema: any = createGenerator(config).createSchema(config.type);
export const schemaString = JSON.stringify(schema, null, 2);
