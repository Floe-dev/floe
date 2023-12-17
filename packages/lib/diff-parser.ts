import gitDiffParser from "gitdiff-parser";

export function parseDiff(diffText: string) {
  const files = gitDiffParser.parse(diffText);
  // TODO: Only return what we need from output

  return files;
}
