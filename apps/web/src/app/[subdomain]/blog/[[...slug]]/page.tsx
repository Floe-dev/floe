import React from "react";
import { withFloeServerPages, FloePageProps } from "@floe/next";
import Link from "next/link";
import NotFound from "@/app/NotFound";
import Blog from "./Blog";
import BlogItem from "./BlogItem";
import AmorphousBlob from "@/components/AmorphousBlob";
import { getFloeClient } from "@/app/floe-client";
import { generateURL } from "@/utils/generateURL";
import type { Metadata, ResolvingMetadata } from "next";
import { capitalize } from "@floe/utils";

export const revalidate = 10;

type Props = {
  params: { subdomain: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const floeClient = getFloeClient(params.subdomain);
  const project = await floeClient.project.get();

  return {
    title: "Blog - " + capitalize(project.name),
    ...(project.favicon && {
      icon: project.favicon,
      shortcut: project.favicon,
      apple: project.favicon,
      other: {
        rel: project.favicon,
        url: project.favicon,
      },
    }),
    openGraph: {
      title: "Blog - " + capitalize(project.name),
      description: project?.description,
      images: [
        {
          url: project.logo,
          width: 800,
          height: 600,
          alt: project.name,
        },
      ],
    },
  };
}

function BlogPage({
  isError,
  isNode,
  post,
  posts,
  isNotFound,
  params,
}: FloePageProps) {
  if (isNotFound || isError) {
    return <NotFound />;
  }

  const renderBlogOrBlogs = () => {
    if (isNode) {
      return (
        <div className="z-10 w-full max-w-2xl px-6 pt-32 pb-8 mx-auto">
          <div className="w-full max-w-5xl prose dark:prose-invert">
            <Blog blog={post} />
          </div>
        </div>
      );
    }

    return (
      <div className="z-10 flex flex-col-reverse w-full max-w-5xl gap-8 px-6 pt-32 pb-8 mx-auto md:flex-row">
        <section className="flex flex-col -mt-8 md:-mt-6">
          {posts.map((blog) => (
            <Link
              key={blog.slug + blog.datasourceId}
              href={generateURL(
                params.subdomain as unknown as string,
                blog.slug
              )}
            >
              <BlogItem blog={blog} />
            </Link>
          ))}
        </section>
        <section className="relative w-full md:w-80 shrink-0">
          <div className="relative inset-0 md:absolute">
            <div className="relative w-full md:fixed md:w-80">
              <h1 className="mb-3 text-4xl font-semibold tracking-tight sm:font-bold dark:text-white">
                Blog
              </h1>
              <h2 className="mt-2 mb-10 text-lg leading-8 dark:text-gray-300">
                Ideas and articles on building lean startups and better software
              </h2>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <main className="relative z-10 flex flex-col">
      {renderBlogOrBlogs()}
      <AmorphousBlob
        blur={50}
        rotation={0}
        className="fixed -top-1/2 -right-24 scale-x-[2] h-screen w-[300px] opacity-10 md:opacity-20"
      />
    </main>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ params }: { params: any }) => {
  const floeClient = getFloeClient(params.subdomain);

  return withFloeServerPages(BlogPage, floeClient, "blog")({ params });
};
