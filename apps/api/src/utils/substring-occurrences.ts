export function getSubstringOccurrences(string: string, substring: string) {
  const startIndices = [...string.matchAll(new RegExp(substring, "gi"))]
    .map((a) => a.index)
    .filter((index) => index !== undefined) as number[];

  return startIndices.map((startIndex) => {
    const endIndex = startIndex + substring.length;

    return [startIndex, endIndex];
  });
}
