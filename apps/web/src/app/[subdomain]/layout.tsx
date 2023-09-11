import { getFloeClient } from "@/app/floe-client";
import Nav from "@/app/[subdomain]/_components/Nav";
import { Footer } from "./_components/Footer";

export default async function ChangelogLayout({
  params,
  children,
}: {
  params: { subdomain: string };
  children: React.ReactNode;
}) {
  const floeClient = getFloeClient(params.subdomain);
  const project = await floeClient.project.get();

  return (
    <>
      <Nav
        logo={project.logo}
        projectName={project.name}
        homepageURL={project.homepageURL}
      />
      {children}
      <Footer />
    </>
  );
}
