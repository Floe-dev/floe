import React from "react";
import AmorphousBlob from "@/app/AmorphousBlob";
import { getFloeClient } from "@/app/floe-client";
import { withFloeServerPages, FloePageProps } from "@floe/next";
import TableOfContents from "./TableOfContents";
import Link from "next/link";
import DocItem from "./DocPage";
import NotFound from "@/app/NotFound";

export const revalidate = 10;

async function DocsPage({
  isError,
  isNode,
  post,
  posts,
  isNotFound,
  floeClient,
}: FloePageProps) {
  let fileTree: Awaited<ReturnType<typeof floeClient.post.getTree>>;

  try {
    fileTree = await floeClient.post.getTree("docs");
  } catch (e) {
    console.error(e);
  }

  if (isNotFound || isError) {
    return <NotFound />;
  }

  const renderDocOrDocs = () => {
    return (
      <>
        <section className="relative w-full md:w-60 shrink-0">
          <div className="relative inset-0 md:absolute">
            <div className="relative w-full md:fixed md:w-60">
              <TableOfContents fileTree={fileTree} />
            </div>
          </div>
        </section>
        <section className="w-full pt-16 mt-12 prose border-t dark:prose-invert md:pt-0 md:mt-0 border-zinc-700 md:border-0">
          {isNode ? (
            <div className="w-full max-w-5xl prose dark:prose-invert">
              <DocItem doc={post} />
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={post.slug}
                className="mb-2 no-underline"
              >
                <DocItem doc={post} />
              </Link>
            ))
          )}
        </section>
      </>
    );
  };

  return (
    <main className="relative z-10 flex flex-col">
      <div className="flex flex-col-reverse w-full max-w-screen-xl gap-16 px-6 pt-24 pb-8 mx-auto md:px-8 md:flex-row">
        {renderDocOrDocs()}
      </div>
      <AmorphousBlob
        blur={50}
        rotation={0}
        className="fixed top-0 -left-48 scale-x-[2] h-screen w-[300px] opacity-10 md:opacity-20"
      />
    </main>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ params }: { params: any }) => {
  const floeClient = getFloeClient(params.domain);

  return withFloeServerPages(DocsPage, floeClient, "docs")({ params });
};
