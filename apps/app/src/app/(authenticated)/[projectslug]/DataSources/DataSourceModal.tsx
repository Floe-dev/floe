import { useState } from "react";
import { Input, Modal, Select } from "@/components";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server";
import { api } from "@/utils/trpc";
import { useProjectContext } from "@/context/project";
import { useQueryClient } from "@tanstack/react-query";
import { useInstallationsContext } from "@/context/installations";

type RepositorySearchResults =
  inferRouterOutputs<AppRouter>["repository"]["search"];

type BranchSearchResults =
  inferRouterOutputs<AppRouter>["repository"]["searchBranches"];

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const USE_EXISTING_REPO_SELECT_LIST = [
  {
    id: "1",
    name: "Select",
    unavailable: true,
  },
  {
    id: "2",
    name: "Yes",
  },
  {
    id: "3",
    name: "No",
  },
];

export const DataSourceModal = ({ open, setOpen }: ModalProps) => {
  const [selected, setSelected] = useState<{
    id: string;
    name: string;
  }>(USE_EXISTING_REPO_SELECT_LIST[0]);
  const [branchQuery, setBranchQuery] = useState("");
  const [repositoryQuery, setRepositoryQuery] = useState("");
  const { currentProject, queryKey } = useProjectContext();
  const { currentInstallation } = useInstallationsContext();

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = api.dataSource.create.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
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

  const createOrUpdateRepo = () => {
    if (selected.id === "2") {
      return "UPDATE";
    }

    if (selected.id === "3") {
      return "CREATE";
    }

    return undefined;
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Add data source"
      actions={[
        {
          text: "Add data source",
          type: "submit",
          disabled:
            selected.id === "1" || (!selectedBranch && selected.id === "2"),
          onClick: async () => {
            if (selected.id === "2") {
              await mutateAsync({
                projectId: currentProject!.id,
                owner: selectedRepository!.owner.login,
                repository: selectedRepository!.name,
                baseBranch: selectedBranch!.name,
                createOrUpdateRepo: createOrUpdateRepo(),
              });
            } else if (selected.id === "3") {
              await mutateAsync({
                projectId: currentProject!.id,
                // @ts-ignore
                owner: currentInstallation?.account?.login,
                repository: "floe-data",
                baseBranch: "main",
                createOrUpdateRepo: createOrUpdateRepo(),
              });
            }

            setOpen(false);
          },
        },
      ]}
      content={
        <form className="flex flex-col items-start gap-6">
          <Select
            label="Include Floe data with my repository"
            list={USE_EXISTING_REPO_SELECT_LIST}
            selected={selected}
            setSelected={setSelected}
            subtext="If you select 'yes', Floe will create a .floe directory in your repository. If you select 'no', a new standalone Floe data repository will be created under your GitHub account."
          />

          {/* {selected.id === "3" && (
            <Input
              label="Repository name"
              placeholder="floe-data"
              subtext="The name of your Floe data repository."
            />
          )} */}

          {selected.id === "2" && (
            <>
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
                    displayValue={(
                      repository: RepositorySearchResults[number]
                    ) => repository?.name}
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
            </>
          )}
        </form>
      }
    />
  );
};
