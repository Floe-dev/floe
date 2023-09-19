import React from "react";
import Image from "next/image";
import cn from "classnames";
import Link from "next/link";

interface NavProps {
  logo?: string;
  projectName: string;
  homepageURL?: string;
}

const Nav = ({ logo, projectName, homepageURL }: NavProps) => (
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
            <h1 className="text-black dark:text-white">{projectName}</h1>
          )}
        </Link>
      </div>
    </nav>
  </header>
);

export default Nav;
