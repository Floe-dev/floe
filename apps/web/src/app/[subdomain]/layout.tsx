import { getFloeClient } from "@/app/floe-client";
import { ThemeProvider } from "./ThemeProvider";
import AmorphousBlob from "@/components/AmorphousBlob";

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
      {children}
      <AmorphousBlob
        blur={50}
        rotation={0}
        className="fixed -top-1/2 -right-24 scale-x-[2] h-screen w-[300px] opacity-10 md:opacity-20"
      />
      <AmorphousBlob
        blur={50}
        rotation={0}
        className="fixed top-0 -left-48 scale-x-[2] h-screen w-[300px] opacity-5 md:opacity-20"
      />
    </ThemeProvider>
  );
}
