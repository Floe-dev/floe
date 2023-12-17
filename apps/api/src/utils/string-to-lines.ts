export function stringToLines(
  string: string,
  startLine = 1
): Record<string, string> {
  return string.split("\n").reduce((acc, line, index) => {
    return {
      ...acc,
      [`${index + startLine}`]: line,
    };
  }, {});
}
