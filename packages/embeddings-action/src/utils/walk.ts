import { readdir, stat } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

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
        const fileNoExtension = basename(path);

        // Match for md, mdx, or mdoc files
        const doc = immediateFiles.find(
          (f) =>
            f === `${fileNoExtension}.md` ||
            f === `${fileNoExtension}.mdx` ||
            f === `${fileNoExtension}.mdoc`
        );

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
