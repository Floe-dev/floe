import { z } from "zod";
import { db } from "@floe/db";
import { HttpError } from "@floe/lib/http-error";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Octokit } from "octokit";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";
import { parseGitHubInstallationCallback } from "~/lib/github-installation-url";

const schema = z
  .object({
    code: z.string(),
    state: z.string(),
    installationId: z.number(),
    setupAction: z.literal("install"),
  })
  .required();

const handler = async (req) => {
  const searchParams = req.nextUrl.searchParams;

  const { code, state, installationId } = schema.parse({
    code: searchParams.get("code"),
    state: searchParams.get("state"),
    setupAction: searchParams.get("setup_action"),
    installationId: parseInt(searchParams.get("installation_id") as string, 10),
  });

  const session = await getServerSession(authOptions);

  if (!session) {
    throw new HttpError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  const { id, slug, path, url } = parseGitHubInstallationCallback(state);

  if (!path || !slug || !id) {
    throw new HttpError({
      message: "Invalid state",
      statusCode: 400,
    });
  }

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
    redirect(`${url}?installation_error=1`);
  }

  const { access_token: auth } = await resp.json();

  const octokit = new Octokit({
    auth,
  });

  const installationsResp = await octokit.request("GET /user/installations", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  /**
   * Verify user has access to installation
   * https://roadie.io/blog/avoid-leaking-github-org-data/
   */
  if (
    !installationsResp.data.installations.some(
      (installation) => installation.id === installationId
    )
  ) {
    console.log(
      "Installation error. User does not have access to installation."
    );
    redirect(`${url}?installation_error=1`);
  }

  /**
   * Set the githubIntegrationId on the workspace
   */
  try {
    await db.githubIntegration.upsert({
      where: {
        workspaceId: id,
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      create: {
        workspaceId: id,
        installationId,
      },
      update: {
        installationId,
      },
    });
  } catch (e) {
    console.log("Installation error. Failed to update workspace with: ", e);
    redirect(`${url}?installation_error=1`);
  }

  redirect(url);
};

export { handler as GET, handler as POST };
