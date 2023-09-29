"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import SideNav from "./SideNav";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";

export const MobileNav = ({
  fileTree,
  subdomain,
  slugWithBasePath,
}: {
  [key: string]: any;
  subdomain: string;
  slugWithBasePath: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed left-0 z-50 w-full px-6 py-2 top-14 backdrop-blur-2xl bg-background-100/80 dark:bg-background-200/80">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="w-6 h-6 text-gray-400" />
        </button>
      </nav>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-start w-full p-6 pt-20 overflow-y-auto bg-white/70 dark:bg-zinc-900/60 backdrop-blur md:hidden"
      >
        <SideNav
          fileTree={fileTree}
          fontSize="lg"
          subdomain={subdomain}
          slugWithBasePath={slugWithBasePath}
        />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Open sidebar"
        >
          <XMarkIcon className="absolute w-8 h-8 text-zinc-900 dark:text-zinc-100 right-6 top-6" />
        </button>
      </Dialog>
    </>
  );
};
