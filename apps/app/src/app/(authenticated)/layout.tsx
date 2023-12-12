import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  /**
   * Using next-auth https://next-auth.js.org/configuration/nextjs#basic-usage
   * wasn't working. This works well though.
   */
  if (!session) {
    return redirect("/signin");
  }

  return <>{children}</>;
}
