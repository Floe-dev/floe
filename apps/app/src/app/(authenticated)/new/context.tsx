import type { Prisma } from "@floe/db";
import { createContext, useContext } from "react";

export interface DefaultContext {
  step: number;
  setSearchParams: (
    obj: Record<string, string | number | undefined | null>
  ) => void;
  workspace: Prisma.WorkspaceGetPayload<{
    include: {
      githubIntegration: true;
      gitlabIntegration: true;
    };
  }> | null;
  workspaceLoading: boolean;
}

export const StepsContext = createContext<DefaultContext>({} as DefaultContext);
export const useStepsContext = () => useContext(StepsContext);
