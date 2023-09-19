import { getFloeClient } from "@/app/floe-client";
import Nav from "@/app/[subdomain]/_components/Nav";
import { ThemeProvider } from "./ThemeProvider";
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
    <ThemeProvider
      project={project}
      attribute="class"
      defaultTheme={project.appearance.toLocaleLowerCase()}
      enableSystem
    >
      <Nav
        logo={project.logo}
        projectName={project.name}
        homepageURL={project.homepageURL}
      />
      {children}
      <Footer {...project} />
    </ThemeProvider>
  );
}
