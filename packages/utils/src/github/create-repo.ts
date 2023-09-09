import { Octokit } from "octokit";

export const createRepoFromTemplate = async (
  octokit: Octokit,
  {
    templateOwner,
    templateRepo,
    owner,
    name,
    description,
    includeAllBranches,
    privateRepo,
  }: {
    templateOwner: string;
    templateRepo: string;
    owner: string;
    name: string;
    description: string;
    includeAllBranches: boolean;
    privateRepo: boolean;
  }
) => {
  await octokit.request(
    "POST /repos/{template_owner}/{template_repo}/generate",
    {
      template_owner: templateOwner,
      template_repo: templateRepo,
      owner,
      name,
      description,
      include_all_branches: includeAllBranches,
      private: privateRepo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
};
