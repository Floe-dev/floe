import { Endpoints } from "@octokit/types";
import { Context } from "@/server/context";

export const getUserInstallations = async (
  ctx: Context,
) => {
  let userOrgs: Endpoints["GET /user/orgs"]["response"] | undefined;

  let installationsResponse:
    | Endpoints["GET /user/installations"]["response"]
    | undefined;

  try {
    userOrgs = await ctx.octokit.request("GET /user/orgs", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    installationsResponse = await ctx.octokit.request(
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
    ctx.session?.profile.id,
  ];

  const installations =
    installationsResponse?.data.installations.filter((i) => {
      return validInstallations.includes(i.account?.id || 0);
    }) || [];

  return installations;
};
