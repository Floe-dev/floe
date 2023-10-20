"use client";

import React, { useContext, useMemo, useState } from "react";
import { api } from "@floe/trpc";
import { useRouter } from "next/navigation";
import type { AppRouter } from "@floe/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { getCookie, setCookie } from "cookies-next";

export type DefaultContext = {
  installations:
    | inferRouterOutputs<AppRouter>["installation"]["list"]
    | undefined;
  currentInstallation:
    | inferRouterOutputs<AppRouter>["installation"]["list"][number]
    | undefined;
  setCurrentInstallation: (iid: number) => void;
  isLoading: boolean;
};

const InstallationsContext = React.createContext<DefaultContext>(
  {} as DefaultContext
);

const useInstallationsContext = () => useContext(InstallationsContext);

const InstallationsProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [currentInstallationId, setCurrentInstallationId] = useState(
    getCookie("currentInstallationId") &&
      parseInt(getCookie("currentInstallationId") as string, 10)
  );
  const { data: installations, isLoading } = api.installation.list.useQuery();

  const setCurrentInstallation = (iid: number) => {
    setCookie("currentInstallationId", iid);
    setCurrentInstallationId(iid);

    router.push("/");
  };

  const currentInstallation = useMemo(() => {
    if (!installations || isLoading) {
      return undefined;
    }

    if (currentInstallationId) {
      const currInstallation = installations?.find(
        (i) => i.id === currentInstallationId
      );

      if (currInstallation) {
        return currInstallation;
      }
    }

    return installations[0];
  }, [installations, isLoading, currentInstallationId]);

  return (
    <InstallationsContext.Provider
      value={{
        isLoading,
        installations,
        currentInstallation,
        setCurrentInstallation,
      }}
    >
      {children}
    </InstallationsContext.Provider>
  );
};

export { useInstallationsContext, InstallationsProvider };
