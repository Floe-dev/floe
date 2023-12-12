"use client";
import logo from "public/logo.png";
import type { Prisma } from "@floe/db";
import { Dialog, Transition } from "@headlessui/react";
import { classNames } from "@floe/lib/class-names";
import Image from "next/image";
import { Bars3Icon, HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
];

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
  }>;
  workspace: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const workspaces = user.workspaceMemberships.map(
    (membership) => membership.workspace
  );

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
            <div className="fixed inset-0 bg-gray-900/80" />
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
                <div className="flex flex-col px-6 pb-2 overflow-y-auto bg-white grow gap-y-5">
                  <div className="flex items-center h-16 shrink-0">
                    <Image
                      alt="Floe logo"
                      className="w-auto h-6"
                      placeholder="blur"
                      src={logo}
                    />
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
                                    ? "bg-gray-50 text-amber-600"
                                    : "text-gray-700 hover:text-amber-600 hover:bg-gray-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                                href={item.href}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    item.current
                                      ? "text-amber-600"
                                      : "text-gray-400 group-hover:text-amber-600",
                                    "h-6 w-6 shrink-0"
                                  )}
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">
                          Your workspaces
                        </div>
                        <ul className="mt-2 -mx-2 space-y-1">
                          {workspaces.map((ws) => (
                            <li key={ws.name}>
                              <a
                                className={classNames(
                                  ws.slug === workspace
                                    ? "bg-gray-50 text-amber-600"
                                    : "text-gray-700 hover:text-amber-600 hover:bg-gray-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                                href={ws.slug}
                              >
                                <span
                                  className={classNames(
                                    ws.slug === workspace
                                      ? "text-amber-600 border-amber-600"
                                      : "text-gray-400 border-gray-200 group-hover:border-amber-600 group-hover:text-amber-600",
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
        <div className="flex flex-col px-6 overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
          <div className="flex items-center h-16 shrink-0">
            <Image
              alt="Floe logo"
              className="w-auto h-6"
              placeholder="blur"
              src={logo}
            />
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
                            ? "bg-gray-50 text-amber-600"
                            : "text-gray-700 hover:text-amber-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                        href={item.href}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            item.current
                              ? "text-amber-600"
                              : "text-gray-400 group-hover:text-amber-600",
                            "h-6 w-6 shrink-0"
                          )}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Your workspaces
                </div>
                <ul className="mt-2 -mx-2 space-y-1">
                  {workspaces.map((ws) => (
                    <li key={ws.name}>
                      <a
                        className={classNames(
                          ws.slug === workspace
                            ? "bg-gray-50 text-amber-600"
                            : "text-gray-700 hover:text-amber-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                        href={ws.slug}
                      >
                        <span
                          className={classNames(
                            ws.slug === workspace
                              ? "text-amber-600 border-amber-600"
                              : "text-gray-400 border-gray-200 group-hover:border-amber-600 group-hover:text-amber-600",
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
                <a
                  className="flex items-center px-6 py-3 text-sm font-semibold leading-6 text-gray-900 gap-x-4 hover:bg-gray-50"
                  href="#"
                >
                  <img
                    alt=""
                    className="w-8 h-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">Tom Cook</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center px-4 py-4 bg-white shadow-sm gap-x-6 sm:px-6 lg:hidden">
        <button
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => {
            setSidebarOpen(true);
          }}
          type="button"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="w-6 h-6" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Dashboard
        </div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            alt=""
            className="w-8 h-8 rounded-full bg-gray-50"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </a>
      </div>
    </div>
  );
}
