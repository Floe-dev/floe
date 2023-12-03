import { ignoreFiles } from "~/constants/ignore-list";
import type { CompareInfo } from "~/types/compare";

export async function getGitLabGitDiff(
  owner: string,
  repo: string,
  base: string,
  head: string,
  token: string
): Promise<CompareInfo | null> {
  try {
    const queryParams = new URLSearchParams({
      from: base,
      to: head,
      straight: "false",
    }).toString();

    const response = await fetch(
      `https://gitlab.com/api/v4/projects/${owner}%2F${repo}/repository/compare?${queryParams}`,
      {
        headers: {
          "PRIVATE-TOKEN": token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const compareInfo = await response.json();

    const commits = compareInfo.commits.map((commit) => ({
      sha: commit.id,
      message: commit.title,
    }));

    // Access the diff information
    const diffs =
      compareInfo.diffs.reduce((acc, file) => {
        /**
         * Ignore file path if it's in the ignore list
         */
        if (
          ignoreFiles.some((ignoreFile) => file.new_path.includes(ignoreFile))
        ) {
          console.log("Ignoring file: ", file.new_path);
          return acc;
        }

        return [
          ...acc,
          {
            filename: file.new_path,
            content: file.diff ?? "",
            // TODO: Need to verify these
            isDeleted: file.deleted_file === "true",
            contentsUrl: "...",
          },
        ];
      }, []) ?? [];

    return {
      commits,
      diffs,
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
