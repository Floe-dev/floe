import React from "react";
import { withFloeServerPages, FloePageProps } from "@floe/next";
import Link from "next/link";
import NotFound from "@/app/NotFound";
import Subscribe from "@/app/Subscribe";
import Blog from "./Blog";
import BlogItem from "./BlogItem";
import AmorphousBlob from "../../AmorphousBlob";
import { floeClient } from "../../floe-client";

export const revalidate = 10;

function BlogPage({ isError, isNode, post, posts, isNotFound }: FloePageProps) {
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
        <section className="w-full pt-16 mt-12 prose border-t dark:prose-invert md:pt-0 md:mt-0 border-zinc-700 md:border-0">
          {posts.map((blog) => (
            <Link
              key={blog.slug + blog.datasourceId}
              href={blog.slug}
              className="mb-2 no-underline"
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

              <Subscribe className="max-w-sm" />
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

export default withFloeServerPages(BlogPage, floeClient, "blog");
