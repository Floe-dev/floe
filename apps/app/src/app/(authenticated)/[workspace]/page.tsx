import { getServerSession } from "next-auth";
import { db } from "@floe/db";
import { authOptions } from "~/server/auth";
import Keys from "./keys";

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
        <h2 className="mb-2">Dashboard</h2>
        <p>Manage your keys and integrations.</p>
      </div>
      {/* Next steps */}
      <div className="px-6 py-5 mb-4 prose bg-white rounded-lg shadow prose-zinc">
        <h3 className="text-base font-semibold leading-6 text-zinc-900">
          Next steps
        </h3>
        <p className="mt-2 text-sm text-gray-500">Complete your Floe setup.</p>
        <ul className="p-0 list-none">
          <li className="flex items-center gap-x-4">
            <div className="flex items-center justify-center w-6 h-6 m-0 text-sm rounded-full bg-amber-100 text-amber-800">
              1
            </div>
            <p className="m-0">
              Generate an API key and store it somewhere safe.
            </p>
          </li>
          <li className="flex items-center gap-x-4">
            <div className="flex items-center justify-center w-6 h-6 m-0 text-sm rounded-full bg-amber-100 text-amber-800">
              2
            </div>
            <p className="m-0">Connect to GitHub. (Optional)</p>
          </li>
          <li className="flex items-center gap-x-4">
            <div className="flex items-center justify-center w-6 h-6 m-0 text-sm rounded-full bg-amber-100 text-amber-800">
              3
            </div>
            <p className="m-0">Install the CLI and initialize Floe.</p>
          </li>
        </ul>
      </div>

      <Keys workspace={workspace} />
    </div>
  );
}
