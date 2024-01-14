import { z } from "zod";
import { db } from "@floe/db";
import { HttpError } from "@floe/lib/http-error";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";
import { parseGitHubInstallationCallback } from "~/lib/features/github-installation";
import { getOctokit } from "./get-octokit";

const schema = z.object({
  code: z.string(),
  state: z.string().nullish(),
  installationId: z.coerce.number().nullish(),
  setupAction: z.enum(["install", "request"]),
});

const handler = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const { code, state, installationId, setupAction } = schema.parse({
    code: searchParams.get("code"),
    state: searchParams.get("state"),
    setupAction: searchParams.get("setup_action"),
    installationId: searchParams.get("installation_id"),
  });

  const session = await getServerSession(authOptions);
  /**
   * Handle request install action.
   * This happens when a GitHub app needs to go through approval.
   */
  if (setupAction === "request") {
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

  /**
   * INSTALL ACTION
   * If not request, then it's an install action.
   */

  /**
   * If there is state, this was triggered from a workflow where the approval
   * flow was not required (eg. when the user is the owner)
   */
  if (state) {
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
          status: "installed",
        },
        update: {
          installationId,
          status: "installed",
        },
      });
    } catch (e) {
      console.log("Installation error. Failed to update workspace with: ", e);
      redirect(`${url}?installation_error=1`);
    }

    redirect(url);
  }

  /**
   * If there is no state, this was triggered from a workflow where the approval
   * flow was required (eg. when the user is not the owner).
   *
   * This workflow is not supported by GitHub yet:
   * https://github.com/orgs/community/discussions/42351 SO, we cannot
   * programtically set the installation. Instead, we can just direct the
   * installer (a GitHub admin) to a confirmation page which includes an email
   * link to request access. I then need to manually set the installation and
   * set the status to "installed".
   */
  if (installationId) {
    const octokit = await getOctokit(code);
    const installation = await octokit.request(
      "GET /app/installations/{installation_id}",
      {
        installation_id: installationId,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    /**
     * Email
     */
    const email = "contact@floe.dev";

    /**
     * Let me know that someone has requested an installation.
     */
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      // The body format will vary depending on provider, please see their documentation
      // for further details.
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: "noreply@floe.dev" },
        subject: "📥 Installation Request",
        content: [
          {
            type: "text/plain",
            value: `Installation request for\nInstallation ID:${installationId}\nGitHub Account Name:${installation.data.account?.name}`,
          },
        ],
      }),
      headers: {
        // Authentication will also vary from provider to provider, please see their docs.
        Authorization: `Bearer ${env.SENDGRID_API}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    redirect("/installation-confirmed");
  }
};

export { handler as GET, handler as POST };
