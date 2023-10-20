import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./context";
import { TrpcProvider } from "@floe/trpc/next";
import "@uploadthing/react/styles.css";

const InterFont = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Floe Dashboard",
  description: "Manage your Floe integration",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrpcProvider>
      <html lang="en" className="h-full light">
        <body className={`${InterFont.className} h-full bg-gray-50`}>
          <NextAuthProvider>{children}</NextAuthProvider>
        </body>
      </html>
    </TrpcProvider>
  );
}
