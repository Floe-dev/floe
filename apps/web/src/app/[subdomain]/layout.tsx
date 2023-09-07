import Nav from "@/app/[subdomain]/_components/Nav";

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
