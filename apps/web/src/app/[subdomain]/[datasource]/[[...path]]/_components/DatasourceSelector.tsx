import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import cn from "classnames";
import Link from "next/link";
import { Project, Datasource } from "@floe/next";

interface DatasourceSelectorProps {
  project: Project;
  datasource: Datasource;
}

export const DatasourceSelector = ({
  project,
  datasource,
}: DatasourceSelectorProps) => {
  return (
    <div className="flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
            <span className="overflow-hidden text-gray-400 mr-1 border-gray-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
              {datasource.name.charAt(0).toUpperCase()}
            </span>
            <span className="capitalize truncate">{datasource.name}</span>
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
                Select
              </p>
              {project.datasources?.map((ds) => (
                <Menu.Item key={ds.id}>
                  {({ active }) => (
                    <Link
                      href={`/${project.slug}/${ds.slug}`}
                      className={cn(
                        "flex justify-between px-4 py-2 text-sm capitalize",
                        {
                          "bg-gray-100 text-gray-900": active,
                          "text-gray-700": !active,
                        }
                      )}
                    >
                      {ds.name}
                      {/* {currentProject?.id === project.id && (
                          <CheckIcon
                            className="flex-shrink-0 w-5 h-5 ml-2 text-gray-500"
                            aria-hidden="true"
                          />
                        )} */}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
