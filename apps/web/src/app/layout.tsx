import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { FloeProvider } from "@floe/next";
import "../styles/globals.css";

const InterFont = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Floe.dev</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </head>
      <body className={`${InterFont.className} bg-white dark:bg-zinc-900`}>
        <FloeProvider>
          {children}
          <Analytics />
        </FloeProvider>
      </body>
    </html>
  );
}
