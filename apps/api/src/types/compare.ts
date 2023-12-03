export interface CompareInfo {
  commits: {
    sha: string;
    message: string;
  }[];
  diffs: {
    filename: string;
    content: string;
    isDeleted: boolean;
    contentsUrl: string;
  }[];
}
