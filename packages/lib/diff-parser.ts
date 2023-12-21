import gitDiffParser from "gitdiff-parser";

/**
 * Returns a list of Files containing Hunks
 */
export function parseDiffToFileHunks(diffText: string) {
  const files = gitDiffParser.parse(diffText);

  // Floe will only comment on NEW changes.
  // We only want to collect new and normal lines
  return files
    .filter((f) => f.type !== "delete")
    .map((f) => {
      return {
        path: f.newPath,
        hunks: f.hunks.map((h) => {
          return {
            lineStart: h.newStart,
            content: h.changes.reduce((acc, c) => {
              if (c.type === "insert") {
                return `${acc}${c.content}\n`;
              }

              if (c.type === "normal") {
                return `${acc}${c.content}\n`;
              }

              return acc;
            }, ""),
          };
        }),
      };
    });
}
