import React from "react";
import AmorphousBlob from "@/components/AmorphousBlob";
import { getFloeClient } from "@/app/floe-client";
import { withFloeServerPages, FloePageProps } from "@floe/next";
import Link from "next/link";
import DocItem from "./DocPage";
import NotFound from "@/app/NotFound";
import { MobileNav } from "./MobileNav";
import { generateMetadata as gm } from "@/utils/generateMetaData";
import { StackLayout } from "./StackLayout";

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
  const datasource = await floeClient.datasource.get(params.datasource);
  const currentSection = datasource.sections.find((s) => s.url === params.tab);

  if (isNotFound || isError) {
    return <NotFound />;
  }

  const renderPostOrPosts = async () => {
    const children = isNode ? (
      <div className="w-full">
        <DocItem doc={post} />
      </div>
    ) : (
      posts.map((post) => (
        <Link key={post.slug} href={post.slug} className="mb-2 no-underline">
          <DocItem doc={post} />
        </Link>
      ))
    );

    if (currentSection.stack) {
      const tree = await floeClient.tree.get(params.tab, params.datasource);

      return (
        <StackLayout tree={tree} params={params}>
          {children}
        </StackLayout>
      );
    }

    return <div>Test</div>;
  };

  return (
    <div className="flex flex-col-reverse w-full max-w-screen-xl gap-8 px-6 pt-48 pb-8 mx-auto md:px-8 md:flex-row">
      {await renderPostOrPosts()}
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
