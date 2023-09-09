"use client";

import { Fragment, useState } from "react";
import { EmptyState, Card, Pill } from "@/components";
import { useProjectContext } from "@/context/project";
import {
  CircleStackIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/utils/trpc";
import { Menu, Transition } from "@headlessui/react";
import cn from "classnames";
import { useQueryClient } from "@tanstack/react-query";
import { DataSourceModal } from "./DataSourceModal";

const DataSources = () => {
  const [open, setOpen] = useState(false);
  const { currentProject, queryKey } = useProjectContext();

  const queryClient = useQueryClient();
  const { mutateAsync: deleteDataSource } = api.dataSource.delete.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const emptyUI = (
    <EmptyState
      icon={CircleStackIcon}
      title="No connected data sources"
      description="A data source is a repository containing Floe markdown files. You can connect multiple data sources to a single project."
    />
  );

  return (
    <Card
      title="Data sources"
      subtitle="A data source is a repository containing Floe markdown files."
      actions={[
        {
          text: "Add data source",
          onClick: () => setOpen(true),
        },
      ]}
    >
      {!currentProject?.datasources.length ? (
        emptyUI
      ) : (
        <ul role="list" className="divide-y divide-gray-100">
          {currentProject?.datasources.map((datasource) => (
            <li
              key={datasource.id}
              className="flex items-center justify-between py-5 gap-x-6"
            >
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  {datasource.owner} / {datasource.repo} /{" "}
                  {datasource.baseBranch}
                </h3>
                <Pill color="gray" fontStlye="mono" text={datasource.id} />
              </div>
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
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
                  <Menu.Items className="absolute right-0 z-10 w-32 py-2 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            deleteDataSource({ dataSourceId: datasource.id });
                          }}
                          className={cn(
                            "block px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left",
                            {
                              "bg-gray-50": active,
                            }
                          )}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </li>
          ))}
        </ul>
      )}
      <DataSourceModal open={open} setOpen={setOpen} />
    </Card>
  );
};

export default DataSources;
