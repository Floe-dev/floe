import { Pill } from "@floe/ui";
import Nav from "./Nav";
import AmorphousBlob from "../components/AmorphousBlob";
import Subscribe from "./Subscribe";

export default function Page() {
  return (
    <>
      <Nav hideBackground />
      <div className="relative min-h-screen">
        {/* HERO */}
        <div className="relative z-10 flex items-center content-center justify-center pt-32 pb-32 sm:pt-64">
          <div className="relative max-w-[41rem] mx-auto text-left px-6">
            <Pill text="Coming Soon" />
            <h1 className="mt-2 mb-8 text-4xl font-semibold tracking-tight sm:font-bold sm:text-7xl dark:text-white">
              Product Releases Supercharged ⚡️
            </h1>
            <h2 className="mt-2 mb-10 text-lg leading-8 dark:text-gray-300">
              Beautiful docs, wikis, and changelogs that rollout with your code
              changes. No manual orchestration required.
            </h2>

            <Subscribe className="max-w-sm" />
          </div>
        </div>

        {/* BLOBS */}
        <AmorphousBlob className="fixed inset-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <AmorphousBlob
          blur={50}
          rotation={0}
          className="fixed inset-0 w-full translate-y-1/3 scale-[1.6] sm:scale-y-100 sm:scale-x-150 sm:translate-y-1/2 opacity-50"
        />
        <AmorphousBlob
          blur={80}
          rotation={0}
          className="fixed top-0 w-1/2 scale-x-150 -translate-x-1/2 -translate-y-3/4 h-1/2 left-1/2 opacity-10"
        />
      </div>
    </>
  );
}
