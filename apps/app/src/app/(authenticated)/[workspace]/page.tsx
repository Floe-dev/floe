import { getServerSession } from "next-auth";
import { Octokit } from "octokit";
import { redirect } from "next/navigation";
import { db } from "@floe/db";
import type { Prisma } from "@floe/db";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";
import Keys from "./keys";
import { AuthConnect } from "./auth-connect";

async function getWorkspace(workspaceSlug: string) {
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
      encrytpedKeys: {
        select: {
          name: true,
          slug: true,
          createdAt: true,
        },
      },
    },
  });
}

/**
 * We need to securely set the githubIntegrationId on the workspace.
 */
async function setInstallationOnWorkspace(
  code: string,
  workspace: Prisma.WorkspaceGetPayload<{
    include: {
      encrytpedKeys: {
        select: {
          name: true;
          slug: true;
          createdAt: true;
        };
      };
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

export default async function Workspace({
  params,
  searchParams,
}: {
  params: { workspace: string };
  searchParams?: { code?: string; installation_id?: string };
}) {
  const workspace = await getWorkspace(params.workspace);

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  if (searchParams?.code && searchParams.installation_id) {
    await setInstallationOnWorkspace(
      searchParams.code,
      workspace,
      searchParams.installation_id
    );
  }

  return (
    <div>
      <div className="prose prose-zinc">
        <h2 className="mb-2">Welcome back</h2>
        <p>Manage your keys and integrations.</p>
      </div>
      <AuthConnect workspace={workspace} />
      <Keys workspace={workspace} />
    </div>
  );
}
