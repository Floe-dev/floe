import { getFloeClient } from "@/app/floe-client";
import Nav from "@/app/[subdomain]/_components/Nav";

export default async function ChangelogLayout({
  params,
  children,
}: {
  params: { subdomain: string };
  children: React.ReactNode;
}) {
  const floeClient = getFloeClient(params.subdomain);
  const project = await floeClient.project.get();
  console.log(11111, project);

  return (
    <>
      <Nav projectName={project.name} />
      {children}
    </>
  );
}
