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
              className="mt-2 text-gray-500 text-md"
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
                className="self-start block p-8 -mx-8 transition rounded-none md:mx-0 md:rounded-xl group hover:bg-gray-100"
                href={page.route}
                key={page.route}
              >
                <div className="visible pb-4 md:hidden md:py-8">{timeEl}</div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 leading-[1.3]">
                  {page.meta?.title || page.frontMatter.title || page.name}
                </h3>
                <p>{page.frontMatter.subheading}</p>
                <div className="mt-4 text-amber-600">Read more →</div>
              </Link>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
