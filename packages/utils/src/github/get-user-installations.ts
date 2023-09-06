import { Endpoints } from "@octokit/types";
import { Octokit } from "octokit";

export const getUserInstallations = async (
  octokit: Octokit,
  userId: string
) => {
  let userOrgs: Endpoints["GET /user/orgs"]["response"] | undefined;

  let installationsResponse:
    | Endpoints["GET /user/installations"]["response"]
    | undefined;

  try {
    userOrgs = await octokit.request("GET /user/orgs", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    installationsResponse = await octokit.request(
      "GET /user/installations",
      {}
    );
  } catch (e) {
    console.log("Failed to fetch installations");
  }

  /**
   * By default, /user/installations will show installations for which the user
   * is just a collaborator.
   *
   * We should only show installations for which the user has access via an
   * organization, or for the personal User account.
   */
  const validInstallations = [
    ...(userOrgs?.data.map((uo) => uo.id) || []),
    userId,
  ];

  const installations =
    installationsResponse?.data.installations.filter((i) => {
      return validInstallations.includes(i.account?.id || 0);
    }) || [];

  return installations;
};
