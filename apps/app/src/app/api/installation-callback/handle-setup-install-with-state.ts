import type { z } from "zod";
import { db } from "@floe/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { HttpError } from "@floe/lib/http-error";
import { parseGitHubInstallationCallback } from "~/lib/features/github-installation";
import { authOptions } from "~/server/auth";
import type { schema } from "./schema";
import { getOctokit } from "./get-octokit";

export async function handleSetupInstallWithState(
  parsedSchema: z.infer<typeof schema> & { state: string }
) {
  const { state, code, installationId } = parsedSchema;
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new HttpError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  const { id, slug, path, url } = parseGitHubInstallationCallback(state);

  try {
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
      // This should always trigger the 'create'. But, if it doesn't, we
      // should still update the installationId.
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
}
