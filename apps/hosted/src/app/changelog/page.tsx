import React from "react";
import Changelog from "./Changelog";
import AmorphousBlob from "../AmorphousBlob";
import Subscribe from "../Subscribe";
import { floeClient } from "../floe-client";
import { RenderedPostContent } from "@floe/next";
import NotFound from "../NotFound";

export const revalidate = 10;

export default async function ChangelogListPage() {
  let changelogOrChangelogs: Awaited<
    ReturnType<typeof floeClient.post.getListOrNode>
  >;

  try {
    changelogOrChangelogs = await floeClient.post.getListOrNode("changelog");
  } catch (e) {
    console.error(e);
  }

  if (!changelogOrChangelogs) {
    return <NotFound />;
  }

  const renderChangelogOrChangelogs = () => {
    if (changelogOrChangelogs.isNode) {
      return <Changelog changelog={changelogOrChangelogs.data as RenderedPostContent} />;
    }

    return (changelogOrChangelogs.data as RenderedPostContent[]).map((changelog) => (
      <Changelog changelog={changelog} key={changelog.slug} />
    ));
  };

  return (
    <main className="relative z-10 flex flex-col">
      <div className="flex flex-col w-full max-w-5xl gap-8 px-6 pt-32 pb-8 mx-auto md:flex-row">
        <section className="relative w-full md:w-80 shrink-0">
          <div className="relative inset-0 md:absolute">
            <div className="relative w-full md:fixed md:w-80">
              <h1 className="mb-3 text-4xl font-semibold tracking-tight sm:font-bold dark:text-white">
                Changelog
              </h1>
              <h2 className="mt-2 mb-10 text-lg leading-8 dark:text-gray-300">
                Latest updates and improvements
              </h2>

              <Subscribe className="max-w-sm" />
            </div>
          </div>
        </section>
        <section className="w-full pt-16 mt-12 prose border-t dark:prose-invert md:pt-0 md:mt-0 border-zinc-700 md:border-0">
          {renderChangelogOrChangelogs()}
        </section>
      </div>
      <AmorphousBlob
        blur={50}
        rotation={0}
        className="fixed top-0 -left-48 scale-x-[2] h-screen w-[300px] opacity-10 md:opacity-20"
      />
    </main>
  );
}
