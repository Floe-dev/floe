import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import Form from "./form";

export default async function Page(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/");
  }

  return (
    <div className="px-4">
      <Form />
    </div>
  );
}
