import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";

export const getOctokit = async (installationId: number) => {
  if (!process.env.APP_ID || !process.env.PRIVATE_KEY) {
    throw new Error("APP_ID or PRIVATE_KEY not set");
  }

  /**
   * Generate JWT
   * See Step 1: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app#generating-an-installation-access-token
   */
  const auth = createAppAuth({
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
  });

  // Retrieve installation access token
  const installationAuthentication = await auth({
    type: "installation",
    installationId,
  });

  return new Octokit({
    auth: installationAuthentication.token,
  });
};
