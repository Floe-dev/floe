"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import TableOfContents from "./TableOfContents";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";

export const MobileNav = ({ fileTree }: { [key: string]: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed left-0 z-50 w-full px-6 py-2 top-14 backdrop-blur-2xl bg-zinc-900/80">
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
        className="fixed inset-0 z-50 flex items-start w-full p-6 pt-20 overflow-y-auto bg-zinc-900/50 backdrop-blur md:hidden"
      >
        <TableOfContents fileTree={fileTree} fontSize="lg" />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Open sidebar"
        >
          <XMarkIcon className="absolute w-8 h-8 text-white right-6 top-6" />
        </button>
      </Dialog>
    </>
  );
};
