import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Nav } from "./nav";
import "../globals.css";

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
        <main className={`${inter.variable} ${itcGaramondStd.variable}`}>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
