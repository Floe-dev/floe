import type { Octokit } from "@octokit/core";
import { ignoreFiles } from "~/constants/ignore-list";
import type { CompareInfo } from "~/types/compare";

export async function getGitHubGitDiff(
  owner: string,
  repo: string,
  base: string,
  head: string,
  octokit: Octokit
): Promise<CompareInfo | null> {
  try {
    const compareInfo = await octokit.request(
      // could make this more open ended
      `GET /repos/{owner}/{repo}/compare/{base}...{head}`,
      {
        owner,
        repo,
        base,
        head,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const commits = compareInfo.data.commits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
    }));

    // Access the diff information
    const diffs =
      compareInfo.data.files?.reduce((acc, file) => {
        /**
         * Ignore file path if it's in the ignore list
         */
        if (
          ignoreFiles.some((ignoreFile) => file.filename.includes(ignoreFile))
        ) {
          console.log("Ignoring file: ", file.filename);
          return acc;
        }

        return [
          ...acc,
          {
            filename: file.filename,
            content: file.patch ?? "",
            isDeleted: file.status === "removed",
            contentsUrl: file.contents_url,
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
