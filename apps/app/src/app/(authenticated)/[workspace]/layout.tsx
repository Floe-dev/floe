import { getServerSession } from "next-auth/next";
import { db } from "@floe/db";
import { authOptions } from "~/server/auth";
import { Nav } from "./nav";

async function getUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return db.user.findUnique({
    where: { id: session.user.id },
    include: {
      workspaceMemberships: {
        include: {
          workspace: true,
        },
      },
    },
  });
}

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string };
}) {
  const user = await getUser();

  return (
    <>
      <Nav user={user} workspace={params.workspace} />
      <main className="z-50 py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  );
}
