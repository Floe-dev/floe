import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import Form from "./Form";

export default async function Page() {
  const providers = await getProviders();
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (session?.user && !session?.error) {
    return redirect("/");
  }

  return <Form providers={providers} />;
}
