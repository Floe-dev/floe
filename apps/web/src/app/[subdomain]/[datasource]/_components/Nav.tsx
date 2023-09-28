import React from "react";
import Image from "next/image";
import cn from "classnames";
import Link from "next/link";
import { Project } from "@floe/next";

interface NavProps {
  project: Project;
  datasource: string;
}

const Nav = ({
  project: { logo, name, homepageURL, datasources },
  datasource,
}: NavProps) => {
  const currentDataSource = datasources.find(
    (ds) => ds.slug.toLowerCase() === datasource.toLowerCase()
  ) as any;

  console.log(datasources, datasource, currentDataSource);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 backdrop-blur-2xl bg-background-100/70 dark:bg-background-200/70 border-b border-gray-100 dark:border-gray-800"
      )}
    >
      <nav
        className="flex items-center justify-between max-w-screen-xl px-6 py-4 m-auto md:px-8"
        aria-label="Global"
      >
        <div className="flex items-center justify-between flex-1">
          <Link href={homepageURL ?? ""} className="-m-1.5 p-1.5">
            {logo ? (
              <Image
                priority
                src={logo}
                width="0"
                height="0"
                sizes="100vw"
                className="w-auto h-6 dark:invert"
                alt="Follow us on Twitter"
              />
            ) : (
              <h1 className="text-black dark:text-white">{name}</h1>
            )}
          </Link>
        </div>
      </nav>
      {/* Subnav */}
      <nav
        className="flex items-center max-w-screen-xl gap-8 px-6 py-4 m-auto md:px-8"
        aria-label="Global"
      >
        {currentDataSource.config.tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/${tab.key}`}
            className="text-sm font-medium text-gray-500 no-underline transition-all m-left dark:text-gray-500 hover:dark:text-gray-400 hover:text-gray-600"
          >
            {tab.title}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Nav;
