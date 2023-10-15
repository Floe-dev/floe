import { getFloeClient } from "@/app/floe-client";
import { getFirstPageOfSections } from "@/utils/sections";
import { redirect } from "next/navigation";
import { generateURL } from "@/utils/generateURL";
import ErrorPage from "./_components/ErrorPage";
import SideNav from "./_components/SideNav";
import Nav from "./_components/Nav";
import { Footer } from "./Footer";

export default async function ChangelogLayout({
  params,
  children,
}: {
  params: { subdomain: string; datasource: string; path: string[] };
  children: React.ReactNode;
}) {
  const floeClient = getFloeClient(params.subdomain);
  const project = await floeClient.project.get();
  const datasource = await floeClient.datasource.get(params.datasource);

  if (!datasource.sections) {
    return <ErrorPage message="Config not found" />;
  }

  if (!params.path?.length) {
    redirect(
      generateURL(
        params.subdomain,
        params.datasource,
        getFirstPageOfSections(datasource.sections)
      )
    );
  }

  return (
    <div className="flex">
      <header className="fixed z-20 hidden h-full p-4 border-r border-gray-100 lg:block lg:w-72 xl:w-80 backdrop-blur-2xl bg-background-100/70 dark:bg-background-200/70 dark:border-gray-800">
        <SideNav params={params} project={project} datasource={datasource} />
      </header>
      <div className="relative flex flex-col w-full h-full min-h-screen lg:ml-72 xl:ml-80 flex: 1">
        <Nav project={project} datasource={datasource} params={params} />
        <main className="z-10 flex flex-col flex-1">{children}</main>
        <Footer {...project} />
      </div>
    </div>
  );
}
