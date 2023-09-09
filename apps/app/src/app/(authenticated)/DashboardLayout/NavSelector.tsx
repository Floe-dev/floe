import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useInstallationsContext } from "@/context/installations";
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/20/solid";
import cn from "classnames";
import Link from "next/link";
import { useProjectContext } from "@/context/project";
import Image from "next/image";

const NavSelector = () => {
  const { installations, currentInstallation, setCurrentInstallation } =
    useInstallationsContext();

  const { projects, currentProject } = useProjectContext();

  return (
    <div className="flex items-center">
      <ChevronRightIcon
        className="flex-shrink-0 w-5 h-5 text-gray-400"
        aria-hidden="true"
      />
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
            <span className="overflow-hidden text-gray-400 mr-1 border-gray-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
              {/* @ts-ignore */}
              {/* {currentInstallation?.account?.login?.charAt(0).toUpperCase()} */}
              {currentInstallation?.account?.avatar_url && (
                <Image
                  src={currentInstallation?.account?.avatar_url}
                  height={24}
                  width={24}
                  alt="Github Avatar"
                />
              )}
            </span>
            <span className="truncate">
              {/* @ts-ignore */}
              {currentInstallation?.account?.login}
            </span>
            <ChevronUpDownIcon
              className="w-5 h-5 -mr-1 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 w-56 mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <p className="px-4 py-2 text-sm font-semibold text-gray-700">
                GitHub Organisations
              </p>
              {installations?.map((installation) => (
                <Menu.Item key={installation.id}>
                  {({ active }) => (
                    <button
                      className={cn(
                        "flex justify-between px-4 py-2 text-sm w-full",
                        {
                          "bg-gray-100 text-gray-900": active,
                          "text-gray-700": !active,
                        }
                      )}
                      onClick={() => setCurrentInstallation(installation.id)}
                    >
                      {/* @ts-ignore */}
                      {installation.account?.login}
                      {currentInstallation?.id === installation.id && (
                        <CheckIcon
                          className="flex-shrink-0 w-5 h-5 ml-2 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )}
                </Menu.Item>
              ))}
              <Menu.Item>
                {({ active }) => (
                  <a
                    href={`https://github.com/apps/${
                      process.env.NEXT_PUBLIC_APP_NAME ?? "floe-app"
                    }/installations/select_target`}
                    className={cn(
                      "flex justify-between px-4 py-2 text-sm w-full border-t items-center",
                      {
                        "bg-gray-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    New Installation{" "}
                    <ArrowUpRightIcon className="flex-shrink-0 w-5 h-5 ml-2 text-gray-500" />
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      {currentProject && (
        <>
          <ChevronRightIcon
            className="flex-shrink-0 w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                <span className="overflow-hidden text-gray-400 mr-1 border-gray-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                  {currentProject.name.charAt(0).toUpperCase()}
                </span>
                <span className="truncate">{currentProject.name}</span>
                <ChevronUpDownIcon
                  className="w-5 h-5 -mr-1 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 z-10 w-56 mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <p className="px-4 py-2 text-sm font-semibold text-gray-700">
                    Projects
                  </p>
                  {projects?.map((project) => (
                    <Menu.Item key={project.id}>
                      {({ active }) => (
                        <Link
                          href={`/${project.slug}`}
                          className={cn(
                            "flex justify-between px-4 py-2 text-sm",
                            {
                              "bg-gray-100 text-gray-900": active,
                              "text-gray-700": !active,
                            }
                          )}
                        >
                          {project.name}
                          {currentProject?.id === project.id && (
                            <CheckIcon
                              className="flex-shrink-0 w-5 h-5 ml-2 text-gray-500"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </>
      )}
    </div>
  );
};

export default NavSelector;
