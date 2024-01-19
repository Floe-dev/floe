"use client";

import logo from "public/logo.png";
import type { Prisma } from "@floe/db";
import { Menu, Dialog, Transition } from "@headlessui/react";
import { classNames } from "@floe/lib/class-names";
import Image from "next/image";
import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  CreditCardIcon,
  PuzzlePieceIcon,
  CodeBracketSquareIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Nav({
  user,
  workspace,
}: {
  user: Prisma.UserGetPayload<{
    include: {
      workspaceMemberships: {
        include: {
          workspace: true;
        };
      };
    };
  }> | null;
  workspace: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const workspaces = user?.workspaceMemberships.map(
    (membership) => membership.workspace
  );

  const navigation = [
    {
      name: "Home",
      href: `/${workspace}`,
      icon: HomeIcon,
      current: pathname === `/${workspace}`,
    },
    {
      name: "Integrations",
      href: `/${workspace}/integrations`,
      icon: PuzzlePieceIcon,
      current: pathname === `/${workspace}/integrations`,
    },
    {
      name: "Developers",
      href: `/${workspace}/developers`,
      icon: CodeBracketSquareIcon,
      current: pathname === `/${workspace}/developers`,
    },
    {
      name: "Billing",
      href: `/${workspace}/billing`,
      icon: CreditCardIcon,
      current: pathname === `/${workspace}/billing`,
    },
  ];

  return (
    <div>
      <Transition.Root as={Fragment} show={sidebarOpen}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-zinc-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                    <button
                      className="-m-2.5 p-2.5"
                      onClick={() => {
                        setSidebarOpen(false);
                      }}
                      type="button"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        aria-hidden="true"
                        className="w-6 h-6 text-white"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex flex-col px-6 pt-6 pb-2 overflow-y-auto bg-white grow gap-y-5">
                  <div className="flex items-center mb-6 shrink-0">
                    <Image alt="Floe logo" className="w-auto h-6" src={logo} />
                  </div>
                  <nav className="flex flex-col flex-1">
                    <ul className="flex flex-col flex-1 gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                className={classNames(
                                  item.current
                                    ? "bg-zinc-50 text-amber-600"
                                    : "text-zinc-700 hover:text-amber-600 hover:bg-zinc-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold items-center"
                                )}
                                href={item.href}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    item.current
                                      ? "text-amber-600"
                                      : "text-zinc-400 group-hover:text-amber-600",
                                    "h-5 w-5 shrink-0"
                                  )}
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-zinc-400">
                          Your workspaces
                        </div>
                        <ul className="mt-2 -mx-2 space-y-1">
                          {workspaces?.map((ws) => (
                            <li key={ws.name}>
                              <a
                                className={classNames(
                                  ws.slug === workspace
                                    ? "bg-zinc-50 text-amber-600"
                                    : "text-zinc-700 hover:text-amber-600 hover:bg-zinc-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                                href={`/${ws.slug}`}
                              >
                                <span
                                  className={classNames(
                                    ws.slug === workspace
                                      ? "text-amber-600 border-amber-600"
                                      : "text-zinc-400 border-zinc-200 group-hover:border-amber-600 group-hover:text-amber-600",
                                    "capitalize flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                                  )}
                                >
                                  {ws.slug[0]}
                                </span>
                                <span className="truncate">{ws.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col px-6 pt-6 overflow-y-auto bg-white border-r border-zinc-200 grow gap-y-5">
          <div className="flex items-center mb-6 shrink-0">
            <Image alt="Floe logo" className="w-auto h-6" src={logo} />
          </div>
          <nav className="flex flex-col flex-1">
            <ul className="flex flex-col flex-1 gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        className={classNames(
                          item.current
                            ? "bg-zinc-50 text-amber-600"
                            : "text-zinc-700 hover:text-amber-600 hover:bg-zinc-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold items-center"
                        )}
                        href={item.href}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            item.current
                              ? "text-amber-600"
                              : "text-zinc-400 group-hover:text-amber-600",
                            "h-5 w-5 shrink-0"
                          )}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-zinc-400">
                  Your workspaces
                </div>
                <ul className="mt-2 -mx-2 space-y-1">
                  {workspaces?.map((ws) => (
                    <li key={ws.name}>
                      <a
                        className={classNames(
                          ws.slug === workspace
                            ? "bg-zinc-50 text-amber-600"
                            : "text-zinc-700 hover:text-amber-600 hover:bg-zinc-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                        href={`/${ws.slug}`}
                      >
                        <span
                          className={classNames(
                            ws.slug === workspace
                              ? "text-amber-600 border-amber-600"
                              : "text-zinc-400 border-zinc-200 group-hover:border-amber-600 group-hover:text-amber-600",
                            "capitalize flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                          )}
                        >
                          {ws.slug[0]}
                        </span>
                        <span className="truncate">{ws.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto -mx-6">
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center w-full px-6 py-3 text-sm leading-6 gap-x-4 hover:bg-zinc-50">
                    <span className="sr-only">Open user menu</span>
                    <span className="hidden overflow-hidden lg:flex lg:items-center">
                      <span className="text-zinc-400 border-zinc-200 group-hover:border-amber-600 group-hover:text-amber-600 capitalize flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                        {user?.email[0]}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-3 text-sm truncate text-zinc-600"
                      >
                        {user?.email}
                      </span>
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute bottom-full left-6 z-10 mb-2.5 min-w-[150px] origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-zinc-900/5 focus:outline-none">
                      <Menu.Item>
                        <button
                          className="flex items-center w-full gap-2 px-3 py-1 text-sm leading-6 text-left text-zinc-900 hover:bg-zinc-50"
                          onClick={() => signOut()}
                          type="button"
                        >
                          <ArrowRightOnRectangleIcon className="h-5" /> Sign out
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center px-4 py-4 bg-white shadow-sm gap-x-6 sm:px-6 lg:hidden">
        <button
          className="-m-2.5 p-2.5 text-zinc-700 lg:hidden"
          onClick={() => {
            setSidebarOpen(true);
          }}
          type="button"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="w-6 h-6" />
        </button>
        <div className="ml-auto">
          <Menu as="div" className="relative">
            <Menu.Button>
              <span className="sr-only">Open user menu</span>
              <span className="flex items-center justify-center w-8 h-8 text-xs font-medium capitalize bg-white border rounded-lg text-zinc-400 border-zinc-200 group-hover:border-amber-600 group-hover:text-amber-600 shrink-0">
                {user?.email[0]}
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute top-full right-0 z-10 mt-2.5 min-w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-zinc-900/5 focus:outline-none">
                <p className="block px-3 py-1 mb-2 text-sm leading-6 text-zinc-500">
                  {user?.email}
                </p>
                <Menu.Item>
                  <button
                    className="flex items-center w-full gap-2 px-3 py-1 text-sm leading-6 text-left text-zinc-900 hover:bg-zinc-50"
                    onClick={() => signOut()}
                    type="button"
                  >
                    <ArrowRightOnRectangleIcon className="h-5" /> Sign out
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
