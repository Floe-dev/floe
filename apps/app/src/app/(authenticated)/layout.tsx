import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { db } from "@floe/db";
import { Nav } from "./nav";
import { Onboarding } from "./onboarding";
import { authOptions } from "~/server/auth";

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
        <Nav />
        <Onboarding />
      </>
    );
  }

  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}
