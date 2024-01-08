import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const itcGaramondStd = localFont({
  src: "../public/itc-garamond-std.woff2",
  variable: "--font-itc-garamond-std",
});

export default function Nextra({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} ${itcGaramondStd.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
