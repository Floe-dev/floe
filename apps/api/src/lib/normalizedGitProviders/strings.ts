import type { CompareInfo } from "~/types/compare";

export function commitsToString(commits: CompareInfo["commits"]) {
  return commits.map((commit) => commit.message).join("\n");
}

export function diffsToString(diffs: CompareInfo["diffs"]) {
  return diffs
    .map((file) => `filename: ${file.filename}\ndiff: ${file.content}`)
    .join("\n");
}
