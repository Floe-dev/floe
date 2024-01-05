import fs from "node:fs";

export function updateLines(
  filePath: string,
  startLine: number,
  endLine: number,
  newContent: string
) {
  // Read the contents of the file
  const fileContents = fs.readFileSync(filePath, "utf-8").split("\n");

  /**
   * Replace the specified lines with new content
   */
  fileContents.splice(startLine - 1, endLine - startLine + 1, newContent);

  // Write the updated contents back to the file
  fs.writeFileSync(filePath, fileContents.join("\n"), "utf-8");
}
