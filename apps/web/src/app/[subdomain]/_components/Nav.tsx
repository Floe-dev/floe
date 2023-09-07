import React from "react";
import Image from "next/image";
import cn from "classnames";
import Link from "next/link";

interface NavProps {
  projectName: string;
}

const Nav = ({ projectName }: NavProps) => (
  <header
    className={cn(
      "fixed inset-x-0 top-0 z-50 backdrop-blur-2xl bg-zinc-900/80"
    )}
  >
    <nav
      className="flex items-center justify-between px-6 py-4 md:px-8"
      aria-label="Global"
    >
      <div className="flex items-center justify-between flex-1">
        <Link href="/" className="-m-1.5 p-1.5">
          {/* TODO Add logo image*/}
          {projectName}
        </Link>
      </div>
    </nav>
  </header>
);

export default Nav;
