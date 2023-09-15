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
   * Note: This is a hack to get the theme to work. The hack works by:
   * 1) Setting the css var primary and background colours the ones from the
   *    server in the inline style attribute. This ensures the colours looks
   *    correct without any flicker on load.
   * 2) Using the useEffect to also set the ones on the documentElement, so that
   *    the document background colour is also set. Without this line, the user
   *    would see a white background flicker before load.
   *
   * With the current solution, the user will very briefly see the wrong
   * document colour if they scroll up or down very quickly after page load.
   *
   * A better solution might be to split the floe website from the hosted app.
   * Then in the new hosted app, load the root of the application under the
   * subdomain, and set the colours on the server.
   */
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-primary-100",
      project.primary
    );
    document.documentElement.style.setProperty(
      "--color-primary-200",
      project.primaryDark
    );
    document.documentElement.style.setProperty(
      "--color-background-100",
      project.background
    );
    document.documentElement.style.setProperty(
      "--color-background-200",
      project.backgroundDark
    );
  }, []);

  return (
    <NextThemesProvider {...props}>
      <div
        style={
          {
            "--color-primary-100": project.primary,
            "--color-primary-200": project.primaryDark,
            "--color-background-100": project.background,
            "--color-background-200": project.backgroundDark,
          } as React.CSSProperties
        }
        className="bg-background-100 dark:bg-background-200"
      >
        {children}
      </div>
    </NextThemesProvider>
  );
}

export default ThemeProvider;
