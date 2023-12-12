import { getServerSession } from "next-auth";
import { db } from "@floe/db";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import { Onboarding } from "./onboarding";

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

export default async function Root() {
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
    return <Onboarding />;
  }

  redirect(`/${user.workspaceMemberships[0].workspace.slug}`);
}
