import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Nav } from "./nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const itcGaramondStd = localFont({
  src: "./itc-garamond-std.woff2",
  variable: "--font-itc-garamond-std",
});

export const metadata: Metadata = {
  title: "Floe.dev",
  description: "Write Docs That Scale. Automatically.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main
          className={`relative overflow-x-hidden isolate bg-noise after:bg-gradient-to-t after:from-zinc-900 after:opacity-20 after:-z-30 after:absolute after:inset-0 ${inter.variable} ${itcGaramondStd.variable}`}
        >
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
