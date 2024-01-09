import fs from "node:fs";

export function updateLines(
  filePath: string,
  startRow: number,
  endRow: number,
  newContent: string
) {
  // Read the contents of the file
  const fileContents = fs.readFileSync(filePath, "utf-8").split("\n");

  /**
   * Replace the specified lines with new content
   */
  fileContents.splice(startRow - 1, endRow - startRow + 1, newContent);

  // Write the updated contents back to the file
  fs.writeFileSync(filePath, fileContents.join("\n"), "utf-8");
}
