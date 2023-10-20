"use client";

import { Fragment, useState } from "react";
import { Modal, EmptyState, Card } from "@/components";
import { useProjectContext } from "@/context/project";
import {
  CheckIcon,
  ChevronUpDownIcon,
  CircleStackIcon,
  EllipsisVerticalIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { api } from "@floe/trpc/react";
import { Combobox, Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@floe/trpc/server";
import cn from "classnames";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@floe/ui";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import slugify from "slugify";
import Image from "next/image";
import github from "public/github.png";
import gitbranch from "public/git-branch.svg";
import { DatasourceConfigured } from "./DatasourceConfigured";
import Link from "next/link";

type FormData = {
  name: string;
};

type RepositorySearchResults =
  inferRouterOutputs<AppRouter>["repository"]["search"];

type BranchSearchResults =
  inferRouterOutputs<AppRouter>["repository"]["searchBranches"];

const datasourceSchema = yup
  .object({
    name: yup.string().min(3).max(24).required("A project name is required."),
  })
  .required();

const DataSources = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentProject, queryKey } = useProjectContext();
  const [branchQuery, setBranchQuery] = useState("");
  const [repositoryQuery, setRepositoryQuery] = useState("");
  const { data: repositories, isLoading: repositoriesLoading } =
    api.repository.search.useQuery(
      {
        // @ts-ignore
        installationId: currentProject?.installationId,
        query: repositoryQuery,
      },
      {
        enabled: !!currentProject?.installationId && open,
      }
    );
  const [selectedRepository, setSelectedRepository] = useState<
    RepositorySearchResults[number] | null
  >(null);
  const { data: branches, isLoading: branchesLoading } =
    // @ts-ignore
    api.repository.searchBranches.useQuery(
      {
        owner: selectedRepository?.owner.login,
        repository: selectedRepository?.name,
        query: branchQuery,
      },
      {
        enabled: !!selectedRepository,
      }
    );
  const [selectedBranch, setSelectedBranch] = useState<
    BranchSearchResults[number] | null
  >(null);
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = api.dataSource.create.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
  const { mutateAsync: deleteDataSource } = api.dataSource.delete.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
  const {
    watch,
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(datasourceSchema),
  });

  if (!currentProject) {
    return;
  }

  const emptyUI = (
    <EmptyState
      icon={CircleStackIcon}
      title="No connected data sources"
      description="A data source is a repository containing Floe markdown files. You can connect multiple data sources to a single project."
    />
  );

  const slug = watch("name")
    ? slugify(watch("name"), {
        lower: true,
        strict: true,
      })
    : "";

  const siteLink =
    process.env.NODE_ENV === "production"
      ? `https://${currentProject.slug}.floe.dev`
      : `http://localhost:3000/${currentProject.slug}`;

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
              className="flex items-center justify-between py-5 gap-x-6 first:pt-0 last:pb-0"
            >
              <div>
                <h3 className="flex items-center gap-2 mb-1">
                  <Link
                    href={`${siteLink}/${datasource.slug}`}
                    className="flex items-center gap-1 text-sm font-semibold leading-6 text-gray-900 hover:underline"
                    target="_blank"
                  >
                    {datasource.name}
                    <ArrowUpRightIcon className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  {/* @ts-ignore */}
                  <DatasourceConfigured datasource={datasource} />
                </h3>
                <h4 className="flex items-center gap-2">
                  <Image src={github} alt="Github" className="w-4 h-4 invert" />
                  <Link
                    href={`https://github.com/${datasource.owner}/${datasource.repo}`}
                    className="flex items-center gap-1 text-xs leading-6 text-gray-500 hover:underline"
                    target="_blank"
                  >
                    {datasource.owner}/{datasource.repo}
                    {/* <ArrowUpRightIcon
                      className="w-3.5 h-3.5 text-gray-500"
                      aria-hidden="true"
                    /> */}
                  </Link>
                </h4>
                <h4 className="flex items-center gap-2 text-xs leading-6 text-gray-500">
                  <Image src={gitbranch} alt="Github" className="w-4 h-4" />
                  {datasource.baseBranch}
                </h4>
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
      <Modal
        open={open}
        setOpen={setOpen}
        title="Add data source"
        actions={[
          {
            text: "Add data source",
            type: "submit",
            disbaled: !isValid || loading,
            onClick: async () => {
              setLoading(true);
              await mutateAsync({
                name: getValues("name"),
                slug,
                projectId: currentProject!.id,
                owner: selectedRepository!.owner.login,
                repository: selectedRepository!.name,
                baseBranch: selectedBranch!.name,
              }).finally(() => {
                setLoading(false);
              });
              setOpen(false);
            },
          },
        ]}
        content={
          <form className="flex flex-col items-start gap-6">
            <div className="flex w-full gap-4">
              <Input
                label="Name*"
                placeholder="API"
                errortext={errors.name?.message}
                {...register("name", {
                  required: true,
                })}
                disabled={isLoading}
              />
              <Input
                label="Slug*"
                placeholder="api"
                value={slug}
                disabled
                className="bg-gray-100"
              />
            </div>
            <Combobox
              as="div"
              value={selectedRepository}
              onChange={setSelectedRepository}
            >
              <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                Repository
              </Combobox.Label>
              <div className="relative mt-2">
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setRepositoryQuery(event.target.value)}
                  placeholder="Search repositories"
                  displayValue={(repository: RepositorySearchResults[number]) =>
                    repository?.name
                  }
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                  <ChevronUpDownIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>

                {repositories && repositories.length > 0 && (
                  <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {repositories.map((repository) => (
                      <Combobox.Option
                        key={repository.id}
                        value={repository}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={classNames(
                                "block truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {repository.name}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                A repository containing a &quot;.floe&quot; directory.
              </p>
            </Combobox>

            {/* Branch select */}
            <Combobox
              as="div"
              value={selectedBranch}
              onChange={setSelectedBranch}
              disabled={!selectedRepository}
            >
              <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                Release branch
              </Combobox.Label>
              <div className="relative mt-2">
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setBranchQuery(event.target.value)}
                  placeholder="Search branches"
                  displayValue={(branch: BranchSearchResults[number]) =>
                    branch?.name
                  }
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                  <ChevronUpDownIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>

                {branches && branches.length > 0 && (
                  <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {branches.map((branch) => (
                      <Combobox.Option
                        key={branch.name}
                        value={branch}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={classNames(
                                "block truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {branch.name}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This is usually your main branch.
              </p>
            </Combobox>
          </form>
        }
      />
    </Card>
  );
};

export default DataSources;
