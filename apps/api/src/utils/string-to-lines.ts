export function stringToLines(string: string): Record<string, string> {
  return string.split("\n").reduce((acc, line, index) => {
    return {
      ...acc,
      [`${index + 1}`]: line,
    };
  }, {});
}
