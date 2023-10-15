"use client";

import React from "react";
import Image from "next/image";
import cn from "classnames";
import Link from "next/link";
import { Datasource, Project } from "@floe/next";
import { MobileNav } from "./MobileNav";
import { DatasourceSelector } from "./DatasourceSelector";

interface NavProps {
  project: Project;
  datasource: Datasource;
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  };
}

const Nav = ({ datasource, project, params }: NavProps) => {
  return (
    <header
      className={cn(
        "sticky w-full top-0 z-50 backdrop-blur-2xl bg-background-100/70 dark:bg-background-200/70 border-b border-gray-100 dark:border-gray-800"
      )}
    >
      <nav
        className="flex items-center justify-between max-w-screen-xl px-6 py-4 m-auto md:px-8"
        aria-label="Global"
      >
        <div className="flex items-center justify-between flex-1">
          <div className="flex gap-4 lg:hidden">
            <MobileNav
              project={project}
              params={params}
              datasource={datasource}
            />
            <Link href={project.homepageURL ?? ""} className="-m-1.5 p-1.5">
              {project.logo ? (
                <Image
                  priority
                  src={project.logo}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-auto h-6 dark:invert"
                  alt="Follow us on Twitter"
                />
              ) : (
                <h1 className="text-black dark:text-white">{project.name}</h1>
              )}
            </Link>
          </div>
        </div>
        <div className="block lg:hidden">
          <DatasourceSelector project={project} datasource={datasource} />
        </div>
        <div className="hidden lg:block">
          <Link
            href={`https://github.com/${datasource.owner}/${datasource.repo}`}
            className="flex items-center gap-2"
            target="_blank"
          >
            <Image
              priority
              src="/github-mark.svg"
              alt="Github logo"
              width={24}
              height={24}
            />
            <p className="text-sm font-medium truncate max-w-[120px] lowercase text-gray-900">
              {datasource.owner}/{datasource.repo}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
