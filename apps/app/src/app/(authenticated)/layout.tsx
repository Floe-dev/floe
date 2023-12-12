import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { db } from "@floe/db";
import { authOptions } from "~/server/auth";
import { Nav } from "./nav";
import { Onboarding } from "./onboarding";

async function getUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return db.user.findUnique({
    where: { id: session.user.id },
    include: {
      workspaceMemberships: true,
    },
  });
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  /**
   * Using next-auth https://next-auth.js.org/configuration/nextjs#basic-usage
   * wasn't working. This works well though.
   */
  if (!session) {
    return redirect("/signin");
  }

  const user = await getUser();

  if (!user?.workspaceMemberships.length) {
    return (
      <>
        <Onboarding />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  );
}
