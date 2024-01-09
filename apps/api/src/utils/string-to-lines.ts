export function stringToLines(string: string, startLine = 1) {
  return string
    .split("\n")
    .map((line, index) => {
      return `[${startLine + index}] ${line}`;
    })
    .join("\n");
}
