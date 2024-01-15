import { Octokit } from "octokit";
import { env } from "~/env.mjs";

export async function getOctokit(code: string) {
  const queryParams = new URLSearchParams({
    code,
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
  }).toString();

  /**
   * Exchange the code for an access token.
   */
  const resp = await fetch(
    `https://github.com/login/oauth/access_token?${queryParams}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!resp.ok) {
    console.log(
      "Installation error. Failed to get access token with: ",
      resp.status,
      resp.statusText
    );
    // redirect(`${url}?installation_error=1`);
    throw new Error("Failed to get access token");
  }

  const { access_token: auth } = await resp.json();

  return new Octokit({
    auth,
  });
}
