import { z } from "zod";
import { db } from "@floe/db";
import { HttpError } from "@floe/lib/http-error";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import { parseGitHubInstallationCallback } from "~/lib/features/github-installation";
import { getOctokit } from "./get-octokit";

const schema = z.object({
  code: z.string(),
  state: z.string().optional(),
  installationId: z.coerce.number().optional(),
  setupAction: z.enum(["install", "request"]),
});

const handler = async (req) => {
  const searchParams = req.nextUrl.searchParams;

  const { code, state, installationId, setupAction } = schema.parse({
    code: searchParams.get("code"),
    state: searchParams.get("state"),
    setupAction: searchParams.get("setup_action"),
    installationId: searchParams.get("installation_id"),
  });

  /**
   * Handle request install action.
   * This happens when a GitHub app needs to go through approval.
   */
  if (setupAction === "request") {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new HttpError({
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    if (!state) {
      throw new HttpError({
        message: "Invalid state",
        statusCode: 400,
      });
    }

    const { id, slug, path, url } = parseGitHubInstallationCallback(state);

    if (!path || !slug || !id) {
      throw new HttpError({
        message: "Invalid state",
        statusCode: 400,
      });
    }

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
          status: "pending",
        },
        update: {
          status: "pending",
        },
      });
    } catch (e) {
      console.log("Installation error. Failed to update workspace with: ", e);
      redirect(`${url}?installation_error=1`);
    }

    redirect(url);
  }

  return;

  /**
   * If not request, then it's an install action.
   */
  if (state) {
    const { id, slug, path, url } = parseGitHubInstallationCallback(state);

    if (!path || !slug || !id) {
      throw new HttpError({
        message: "Invalid state",
        statusCode: 400,
      });
    }

    const octokit = await getOctokit(code);
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
