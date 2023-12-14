import "~/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Floe dashboard",
  description: "Floe AI writing assistants",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html className="h-full" lang="en">
      <body className={`${inter.className} h-full bg-gray-50`}>{children}</body>
    </html>
  );
}
