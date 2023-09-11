import React from "react";
import Image from "next/image";
import cn from "classnames";
import Link from "next/link";

const Nav = ({ hideBackground = false }) => (
  <header
    className={cn("fixed inset-x-0 top-0 z-50", {
      "backdrop-blur-2xl bg-zinc-950/80": !hideBackground,
    })}
  >
    <nav
      className="flex items-center justify-between px-6 py-4 md:px-8"
      aria-label="Global"
    >
      <div className="flex items-center justify-between flex-1">
        <Link href="/" className="-m-1.5 p-1.5">
          <Image
            priority
            src="/logo-title.svg"
            height={24}
            width={72}
            alt="Follow us on Twitter"
            className="dark:invert"
          />
        </Link>

        <div className="flex gap-4">
          <Link href="/blog" className="text-sm text-white">
            Blog
          </Link>
          <Link href="/changelog" className="text-sm text-white">
            Changelog
          </Link>
        </div>
      </div>
    </nav>
  </header>
);

export default Nav;
