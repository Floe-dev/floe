import { redirect } from "next/navigation";

const handler = (req) => {
  const searchParams = req.nextUrl.searchParams;
  const installationId = parseInt(
    searchParams.get("installation_id") as string,
    10
  );
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const setupAction = searchParams.get("setup_action");

  console.log("installationId", installationId);
  console.log("code", code);
  console.log("state", state);
  console.log("setupAction", setupAction);

  if (!state) {
    throw new Error("Missing state");
  }

  if (!setupAction || setupAction !== "install") {
    redirect(`/${state}?installation_error=1`);
  }

  redirect(`/${state}?installation_id=${installationId}&code=${code}`);
};

export { handler as GET, handler as POST };
