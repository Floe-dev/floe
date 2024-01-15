import type { z } from "zod";
import { db } from "@floe/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { HttpError } from "@floe/lib/http-error";
import { parseGitHubInstallationCallback } from "~/lib/features/github-installation";
import { authOptions } from "~/server/auth";
import type { schema } from "./schema";

export async function handleSetupRequest(parsedSchema: z.infer<typeof schema>) {
  const { state } = parsedSchema;
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

  try {
    if (!path || !slug || !id) {
      throw new HttpError({
        message: "Invalid state",
        statusCode: 400,
      });
    }

    const workspace = await db.workspace.findUnique({
      where: {
        id,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!workspace) {
      throw new HttpError({
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    /**
     * Create githubIntegration record
     */
    await db.githubIntegration.create({
      data: {
        workspaceId: id,
      },
    });
  } catch (e) {
    console.log("Installation error. Failed to update workspace with: ", e);
    redirect(`${url}?installation_error=1`);
  }

  redirect(url);
}
