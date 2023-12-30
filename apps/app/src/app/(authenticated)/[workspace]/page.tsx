import { getServerSession } from "next-auth";
import { db } from "@floe/db";
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

export default async function Workspace({
  params,
}: {
  params: { workspace: string };
}) {
  const workspace = await getWorkspace(params.workspace);

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <div>
      <div className="mb-10 prose prose-zinc">
        <h2 className="mb-2">Welcome back</h2>
        <p>Manage your keys and integrations.</p>
      </div>
      <AuthConnect workspace={workspace} />
      <Keys workspace={workspace} />
    </div>
  );
}
