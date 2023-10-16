"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import SideNav from "./SideNav";
import { Project, Datasource } from "@floe/next";

export const MobileNav = ({
  params,
  project,
  datasource,
}: {
  project: Project;
  datasource: Datasource;
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  };
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="w-6 h-6 text-gray-400" />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-start w-full p-6 pt-20 overflow-y-auto bg-white/70 dark:bg-zinc-900/60 backdrop-blur lg:hidden"
      >
        <SideNav params={params} project={project} datasource={datasource} />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Open sidebar"
        >
          <XMarkIcon className="absolute w-8 h-8 text-zinc-900 dark:text-zinc-100 left-5 top-4" />
        </button>
      </Dialog>
    </>
  );
};
