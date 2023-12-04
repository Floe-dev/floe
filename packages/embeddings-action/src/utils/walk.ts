import { readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface WalkEntry {
  path: string;
  parentPath?: string;
}

export async function walk(
  dir: string,
  parentPath?: string
): Promise<WalkEntry[]> {
  /**
   * Get files from directory
   */
  const immediateFiles = await readdir(dir);

  const recursiveFiles = await Promise.all(
    immediateFiles.map(async (file) => {
      const path = join(dir, file);
      const stats = await stat(path);

      /**
       * Check if file or directory
       */
      if (stats.isDirectory()) {
        // Keep track of document hierarchy (if this dir has corresponding doc file)
        // const docPath = `${basename(path)}.md`;

        // Match for .md, .mdx, or .mdoc files regex
        const doc = immediateFiles.find((f) => /\.(md|mdx|mdoc)$/i.exec(f));

        return walk(path, doc ? join(dirname(path), doc) : parentPath);
      } else if (stats.isFile()) {
        return [
          {
            path,
            parentPath,
          },
        ];
      }
      return [];
    })
  );

  const flattenedFiles = recursiveFiles.reduce(
    (all, folderContents) => all.concat(folderContents),
    []
  );

  return flattenedFiles.sort((a, b) => a.path.localeCompare(b.path));
}
