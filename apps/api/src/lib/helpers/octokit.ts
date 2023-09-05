import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import { CustomMiddleware } from "@/lib/types/middleware";

export const octokit: CustomMiddleware = async (req, res, next) => {
  /**
   * Generate JWT
   * See Step 1: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app#generating-an-installation-access-token
   */
  const auth = createAppAuth({
    appId: process.env.APP_ID!,
    privateKey: process.env.PRIVATE_KEY!,
  });

  // Retrieve installation access token
  const installationAuthentication = await auth({
    type: "installation",
    installationId: req.project?.installationId,
  });

  const octokit = new Octokit({
    auth: installationAuthentication.token,
  });

  req.octokit = octokit;

  await next();
};
