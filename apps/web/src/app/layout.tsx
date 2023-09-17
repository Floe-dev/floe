import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { FloeProvider } from "@floe/next";
import "../styles/globals.css";

const InterFont = Inter({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: null }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </head>
      <body
        className={`${InterFont.className} bg-background-100 dark:bg-background-200`}
      >
        <FloeProvider>
          {children}
          <Analytics />
        </FloeProvider>
      </body>
    </html>
  );
}
