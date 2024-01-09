import fs from "node:fs";

export function updateLines(
  filePath: string,
  startLine: number,
  endLine: number,
  textToReplace: string,
  replaceTextWithFix: string
) {
  // Read the contents of the file
  const fileContents = fs.readFileSync(filePath, "utf-8").split("\n");

  const linesWithoutFix = fileContents
    .slice(startLine - 1, startLine + textToReplace.split("\n").length - 1)
    .join("\n");

  // 2) Check if the content is indeed replaceable. If the LLM returns the
  //    wrong lineNumber, it may not be. In this case we should ignore this result.
  if (!linesWithoutFix.includes(textToReplace)) {
    return;
  }

  // 3) Replace the first instance of the original content with the suggested fix
  //
  const newContent = linesWithoutFix.replace(textToReplace, replaceTextWithFix);

  /**
   * Replace the specified lines with new content
   */
  fileContents.splice(startLine - 1, endLine - startLine + 1, newContent);

  // Write the updated contents back to the file
  fs.writeFileSync(filePath, fileContents.join("\n"), "utf-8");
}
