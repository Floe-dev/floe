"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({
  project,
  children,
  ...props
}: any & ThemeProviderProps) {
  /**
   * This creates a flicker -- need a better solution!
   */
  const primary =
    project.appearance === "LIGHT" ? project.primary : project.primaryDark;
  const background =
    project.appearance === "LIGHT"
      ? project.background
      : project.backgroundDark;

  React.useEffect(() => {
    document.documentElement.style.setProperty("--color-primary", primary);
    document.documentElement.style.setProperty(
      "--color-background",
      background
    );
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default ThemeProvider;
