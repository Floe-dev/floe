export function stringToLines(
  string: string,
  startRow = 1
): Record<string, string> {
  return string.split("\n").reduce((acc, line, index) => {
    return {
      ...acc,
      [`${index + startRow}`]: line,
    };
  }, {});
}
