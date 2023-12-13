import { createContext, useContext } from "react";

interface DefaultContext {
  step: number;
  setSearchParams: (
    obj: Record<string, string | number | undefined | null>
  ) => void;
}

export const StepsContext = createContext<DefaultContext>({} as DefaultContext);
export const useStepsContext = () => useContext(StepsContext);
