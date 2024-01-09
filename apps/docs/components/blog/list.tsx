import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import { Fragment } from "react";
import type { Page } from "nextra";
import type { Frontmatter } from "~/types/frontmatter";

const BLOG_ROUTE = "/blog";

export function BlogList() {
  return (
    <div className="max-w-4xl min-h-screen px-6 pt-4 mx-auto">
      <h1 className="mb-8 nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100">
        Blog
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[160px_auto]">
        {(
          getPagesUnderRoute(BLOG_ROUTE) as (Page & {
            frontMatter: Frontmatter | undefined;
          })[]
        ).map((page) => {
          if (!page.frontMatter) return null;

          const date = new Date(page.frontMatter.date);
          const timeEl = (
            <time
              className="mt-2 text-md text-zinc-500"
              dateTime={date.toLocaleString()}
              suppressHydrationWarning
            >
              {date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          );

          return (
            <Fragment key={page.route}>
              <div className="hidden py-8 md:py-8 md:block">{timeEl}</div>
              <Link
                className="self-start block p-8 -mx-8 transition rounded-none md:mx-0 md:rounded-xl group hover:bg-zinc-100"
                href={page.route}
                key={page.route}
              >
                <div className="visible pb-4 md:hidden md:py-8">{timeEl}</div>
                <h3 className="mb-4 text-lg font-semibold text-zinc-900 leading-[1.3]">
                  {page.meta?.title || page.frontMatter.title || page.name}
                </h3>
                <p>{page.frontMatter.subheading}</p>
                <div className="mt-4 text-amber-600">Read more →</div>
              </Link>
            </Fragment>
            // <Link className="block mb-8 group" href={page.route} key={page.route}>
            //   {page.frontMatter?.ogImage ? (
            //     <div className="relative mt-4 overflow-hidden rounded-md aspect-video">
            //       <Image
            //         alt={page.frontMatter.title}
            //         className="object-cover transition-transform transform group-hover:scale-105"
            //         fill
            //         src={page.frontMatter.ogImage}
            //       />
            //     </div>
            //   ) : null}
            // <div className="block mt-8 text-2xl font-semibold opacity-90 group-hover:opacity-100">
            //   {page.meta?.title || page.frontMatter?.title || page.name}
            // </div>
            // <div className="mt-2 opacity-80 group-hover:opacity-100">
            //   {page.frontMatter?.subheading} <span>Read more →</span>
            // </div>
            //   <div className="flex flex-wrap items-baseline gap-2 mt-3">
            //     {page.frontMatter?.tag ? (
            //       <span className="px-2 py-1 text-xs rounded-sm opacity-80 ring-1 ring-gray-300 group-hover:opacity-100">
            //         {page.frontMatter.tag}
            //       </span>
            //     ) : null}
            //     {page.frontMatter?.date ? (
            //       <span className="text-sm opacity-60 group-hover:opacity-100">
            //         {page.frontMatter.date}
            //       </span>
            //     ) : null}
            //     {page.frontMatter?.author ? (
            //       <span className="text-sm opacity-60 group-hover:opacity-100">
            //         by {page.frontMatter.author}
            //       </span>
            //     ) : null}
            //   </div>
            // </Link>
          );
        })}
      </div>
    </div>
  );
}
