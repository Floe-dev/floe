"use client";

import React, { useContext, useMemo } from "react";
import { api } from "@floe/trpc";
import { usePathname } from "next/navigation";
import type { AppRouter } from "@floe/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { useInstallationsContext } from "./installations";
import { getQueryKey } from "@trpc/react-query";

export type DefaultContext = {
  projects:
    | inferRouterOutputs<AppRouter>["project"]["listByInstallationId"]
    | undefined;
  currentProject:
    | inferRouterOutputs<AppRouter>["project"]["listByInstallationId"][number]
    | undefined;
  isLoading: boolean;
  isFetching: boolean;
  queryKey: any[];
};

const ProjectContext = React.createContext<DefaultContext>(
  {} as DefaultContext
);

const useProjectContext = () => useContext(ProjectContext);

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentInstallation } = useInstallationsContext();
  const pathname = usePathname();
  const slug = pathname?.split("/")[1];

  const queryKey = getQueryKey(
    api.project.listByInstallationId,
    {
      installationId: currentInstallation?.id as number,
    },
    "query"
  );

  const {
    data: projects,
    isLoading,
    isFetching,
  } = api.project.listByInstallationId.useQuery(
    {
      installationId: currentInstallation?.id as number,
    },
    {
      enabled: !!currentInstallation?.id,
    }
  );

  const currentProject = useMemo(() => {
    if (!projects || !slug) {
      return undefined;
    }

    return projects.find((project) => project.slug === slug);
  }, [projects, slug]);

  return (
    <ProjectContext.Provider
      value={{ projects, currentProject, isLoading, isFetching, queryKey }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectProvider, useProjectContext };
