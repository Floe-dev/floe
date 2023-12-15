import * as github from "@actions/github";

export async function fetchComments({
  token,
  owner,
  repo,
  issueNumber,
}: {
  token: string;
  owner: string;
  repo: string;
  issueNumber: number;
}) {
  const octokit = github.getOctokit(token);

  return octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: issueNumber,
  });
}
