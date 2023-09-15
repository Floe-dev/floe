"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

/**
 * Convert hex codes to appropriate rgb vals for Tailwind
 * https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */
const hex2rgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return [r, g, b].join(" ");
};

export function ThemeProvider({
  project,
  children,
  ...props
}: any & ThemeProviderProps) {
  const primary100 = hex2rgb(project.primary);
  const primary200 = hex2rgb(project.primaryDark);
  const background100 = hex2rgb(project.background);
  const background200 = hex2rgb(project.backgroundDark);
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
      primary100
    );
    document.documentElement.style.setProperty(
      "--color-primary-200",
      primary200
    );
    document.documentElement.style.setProperty(
      "--color-background-100",
      background100
    );
    document.documentElement.style.setProperty(
      "--color-background-200",
      background200
    );
  }, []);

  return (
    <NextThemesProvider {...props}>
      <div
        style={
          {
            "--color-primary-100": primary100,
            "--color-primary-200": primary200,
            "--color-background-100": background100,
            "--color-background-200": background200,
          } as React.CSSProperties
        }
        className="min-h-screen bg-background-100 dark:bg-background-200"
      >
        {children}
      </div>
    </NextThemesProvider>
  );
}

export default ThemeProvider;
