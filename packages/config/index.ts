import { createGenerator } from "ts-json-schema-generator";
import fs from "fs";

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
  path: "./types.ts",
  tsconfig: "./tsconfig.json",
  type: "Config", // Or <type-name> if you want to generate schema for that one type only
};

const output_path = "./schema.json";

const schema = createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(output_path, schemaString, (err) => {
  if (err) throw err;
});
