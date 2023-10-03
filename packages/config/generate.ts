import fs from "fs";
import { schemaString } from ".";

const output_path = "./schema.json";

fs.writeFile(output_path, schemaString, (err) => {
  if (err) throw err;
});
