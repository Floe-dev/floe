import { getFloeClient } from "@/app/floe-client";
import SideNav from "./SideNav";
import Nav from "./_components/Nav";
import { Footer } from "./_components/Footer";

export default async function ChangelogLayout({
  params,
  children,
}: {
  params: { subdomain: string; datasource: string; path: string[] };
  children: React.ReactNode;
}) {
  const floeClient = getFloeClient(params.subdomain);
  const project = await floeClient.project.get();
  const tree = await floeClient.tree.get(null, params.datasource);
  const datasource = await floeClient.datasource.get(params.datasource);

  return (
    <div className="flex">
      <SideNav tree={tree} params={params} />
      <div className="relative flex flex-col h-full lg:ml-72 xl:ml-80">
        <Nav project={project} datasource={datasource} params={params} />
        <main className="z-10 flex flex-col flex-1">{children}</main>
        <Footer {...project} />
      </div>
    </div>
  );
}
