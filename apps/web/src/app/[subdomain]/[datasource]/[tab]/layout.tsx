import { getFloeClient } from "@/app/floe-client";
import { ThemeProvider } from "./ThemeProvider";
import { Footer } from "./_components/Footer";
import AmorphousBlob from "@/components/AmorphousBlob";
import Nav from "./_components/Nav";

export default async function ChangelogLayout({
  params,
  children,
}: {
  params: { subdomain: string; datasource: string };
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
      <Nav project={project} datasource={params.datasource} />
      <main className="relative z-10 flex flex-col flex-1">
        {children}
        <AmorphousBlob
          blur={50}
          rotation={0}
          className="fixed -top-1/2 -right-24 scale-x-[2] h-screen w-[300px] opacity-10 md:opacity-20"
        />
      </main>
      <Footer {...project} />
    </ThemeProvider>
  );
}
