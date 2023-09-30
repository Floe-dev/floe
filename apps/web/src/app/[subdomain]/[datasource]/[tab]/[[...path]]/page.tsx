import React from "react";
import AmorphousBlob from "@/components/AmorphousBlob";
import { getFloeClient } from "@/app/floe-client";
import { withFloeServerPages, FloePageProps } from "@floe/next";
import SideNav from "./SideNav";
import Link from "next/link";
import DocItem from "./DocPage";
import NotFound from "@/app/NotFound";
import { MobileNav } from "./MobileNav";
import { generateMetadata as gm } from "@/utils/generateMetaData";

export const revalidate = 10;

// export const generateMetadata = gm("Docs");

async function DocsPage({
  isError,
  isNode,
  post,
  posts,
  isNotFound,
  floeClient,
  params,
}: FloePageProps & {
  params: {
    subdomain: string;
    datasource: string;
    tab: string;
    path: string[];
  };
}) {
  const project = await floeClient.project.get();
  const path = decodeURIComponent(
    [params.tab, ...(params.path ?? [])].join("/")
  );
  const sections = await floeClient.sections.get(path, params.datasource);
  const { datasources } = project;
  const currentDataSource = datasources.find(
    (ds) => ds.slug.toLowerCase() === params.datasource.toLowerCase()
  );

  if (isNotFound || isError) {
    return <NotFound />;
  }

  // const tree = await floeClient.tree.get(path, params.datasource);
  console.log(111, sections);

  const renderPostOrPosts = () => {
    return (
      <>
        <section className="relative hidden w-full md:w-60 shrink-0 md:block">
          <div className="relative inset-0 md:absolute">
            <div className="relative w-full md:fixed md:w-60">
              <SideNav currentDataSource={currentDataSource} params={params} />
            </div>
          </div>
        </section>
        <section className="w-full m-auto mt-12 md:mt-0 border-zinc-700">
          {isNode ? (
            <div className="w-full">
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
    <div className="flex flex-col-reverse w-full max-w-screen-xl gap-8 px-6 pt-48 pb-8 mx-auto md:px-8 md:flex-row">
      {renderPostOrPosts()}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ params }: { params: any }) => {
  const floeClient = getFloeClient(params.subdomain);

  const path = decodeURIComponent(
    [params.tab, ...(params.path ?? [])].join("/")
  );

  return withFloeServerPages({
    Page: DocsPage,
    floeClient,
    path,
    datasourceSlug: params.datasource,
  })({ params });
};
