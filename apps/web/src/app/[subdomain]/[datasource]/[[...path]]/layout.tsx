import { getFloeClient } from "@/app/floe-client";
import SideNav from "./SideNav";

export default async function ChangelogLayout({
  params,
  children,
}: {
  params: { subdomain: string; datasource: string; path: string[] };
  children: React.ReactNode;
}) {
  const floeClient = getFloeClient(params.subdomain);
  const tree = await floeClient.tree.get("/", params.datasource);

  return (
    <main className="relative z-10 flex flex-col flex-1">
      <SideNav tree={tree} params={params} />
      {children}
    </main>
  );
}
