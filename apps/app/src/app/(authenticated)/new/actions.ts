"use server";

import { z } from "zod";
import { db } from "@floe/db";
import { Octokit } from "octokit";
import type { Prisma } from "@floe/db";
import { redirect } from "next/navigation";
import { slugify } from "@floe/lib/slugify";
import { getServerSession } from "next-auth";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";

const schema = z
  .object({
    name: z.string().min(3).max(24),
  })
  .required();

export async function createWorkspace(formData: FormData) {
  const { name } = schema.parse({
    name: formData.get("name"),
  });
  const slug = slugify(name);

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const workspace = await db.workspace.create({
      data: {
        name,
        slug,
        members: {
          createMany: {
            data: [
              {
                userId: session.user.id,
                role: "OWNER",
              },
            ],
          },
        },
      },
    });

    return {
      status: "success",
      message: "Workspace created successfully!",
      slug: workspace.slug,
    };
  } catch (e) {
    return {
      status: "error",
      message:
        e.code === "P2002"
          ? "A workspace with that name already exists."
          : "Workspace could not be created.",
      slug: null,
    };
  }
}

export async function getWorkspace(workspaceSlug: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return db.workspace.findUnique({
    where: {
      slug: workspaceSlug,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      githubIntegration: true,
      gitlabIntegration: true,
    },
  });
}

/**
 * We need to securely set the githubIntegrationId on the workspace.
 */
export async function setInstallationOnWorkspace(
  code: string,
  workspace: Prisma.WorkspaceGetPayload<{
    include: {
      githubIntegration: true;
      gitlabIntegration: true;
    };
  }>,
  installationId: string
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const queryParams = new URLSearchParams({
    code,
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
  }).toString();

  const installtionIdInt = parseInt(installationId, 10);

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
    redirect(`/${workspace.slug}?installation_error=1`);
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
      (installation) => installation.id === installtionIdInt
    )
  ) {
    console.log(
      "Installation error. User does not have access to installation."
    );
    redirect(`/${workspace.slug}?installation_error=1`);
  }

  /**
   * Set the githubIntegrationId on the workspace
   */
  try {
    await db.githubIntegration.upsert({
      where: {
        workspaceId: workspace.id,
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      create: {
        workspaceId: workspace.id,
        installationId: installtionIdInt,
      },
      update: {
        installationId: installtionIdInt,
      },
    });
  } catch (e) {
    console.log("Installation error. Failed to update workspace with: ", e);
    redirect(`/${workspace.slug}?installation_error=1`);
  }

  redirect(`/${workspace.slug}`);
}
