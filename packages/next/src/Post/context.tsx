import React, { useContext } from "react";
import { RootProps } from "./types";

export type DefaultContext = RootProps;

const RootElementContext = React.createContext<DefaultContext>(
  {} as DefaultContext
);
const useRootElement = () => useContext(RootElementContext);

export { useRootElement, RootElementContext };
