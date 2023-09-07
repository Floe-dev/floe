"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RootProps } from "./types";
import { RootElementContext } from "./context";

const FloeProvider = (props: Omit<RootProps, "projectSlug">) => {
  const [queryClient] = React.useState(() => new QueryClient());
  const projectSlug = process.env.NEXT_PUBLIC_FLOE_SLUG;

  if (!projectSlug) {
    throw new Error(
      "FloeProvider: NEXT_PUBLIC_FLOE_SLUG is not defined in .env.local"
    );
  }

  return (
    <RootElementContext.Provider
      value={{
        projectSlug,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </RootElementContext.Provider>
  );
};

export { FloeProvider };
