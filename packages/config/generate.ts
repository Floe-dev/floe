import fs from "node:fs";
import { schemaString } from "./schema.module";

const outputPath = "./schema.json";

fs.writeFile(outputPath, schemaString, (err) => {
  if (err) throw err;
});
