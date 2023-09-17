"use client";

import { ReactNode } from "react";
import Image from "next/image";
import logo from "public/logo.png";
import UserMenu from "./UserMenu";
import Link from "next/link";
import NavSelector from "./NavSelector";
import { useProjectContext } from "@/context/project";
import { Spinner } from "@/components";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { currentProject, isLoading: projectsLoading } = useProjectContext();

  if (projectsLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner />
      </div>
    );
  }

  const projectLinks = [
    {
      name: "Project",
      href: `/${currentProject?.slug}`,
    },
    {
      name: "Appearance",
      href: `/${currentProject?.slug}/appearance`,
    },
    {
      name: "Settings",
      href: `/${currentProject?.slug}/settings`,
    },
  ];

  const dashboardLinks = [
    {
      name: "Dashboard",
      href: "/",
    },
  ];

  return (
    <div className="h-full">
      <nav className="bg-white shadow">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="relative flex justify-between w-full">
              <div className="flex items-stretch justify-start flex-1">
                <div className="flex items-center flex-shrink-0">
                  <Link href="/" className="mr-4">
                    <Image
                      src={logo}
                      alt="Floe logo"
                      className="w-auto h-6"
                      placeholder="blur"
                    />
                  </Link>
                  <NavSelector />
                </div>
              </div>
              <div className="static inset-y-0 inset-auto right-0 flex items-center ml-6">
                <UserMenu />
              </div>
            </div>
          </div>

          <div className="flex h-12 space-x-8">
            {currentProject ? (
              <>
                {projectLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 ${
                      pathname === link.href
                        ? "border-indigo-500"
                        : "border-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {dashboardLinks.map((link) => (
                  <Link
                    href="#"
                    key={link.name}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-indigo-500"
                  >
                    Dashboard
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="px-6 py-10 mx-auto max-w-7xl lg:px-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
