import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useConfig } from "nextra-theme-docs";
import { Authors } from "~/components/authors";
import type { Frontmatter } from "~/types/frontmatter";

interface BlogPostProps {
  children: React.ReactNode;
}

export function BlogPost({ children }: BlogPostProps) {
  const { frontMatter } = useConfig();
  const date = new Date((frontMatter as Frontmatter).date);
  const router = useRouter();

  return (
    <div className="flex flex-col">
      {/* Date */}
      <div className="relative flex flex-col gap-2">
        <button
          aria-label="Go back to posts"
          className="relative flex items-center self-start gap-2 p-2 mb-0 text-sm border rounded-full shadow xl:absolute left:0 xl:-left-20"
          onClick={() => {
            router.back();
          }}
          type="button"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <time
          className="mt-2 nx-text-gray-500 dark:nx-text-gray-400"
          dateTime={date.toLocaleString()}
          suppressHydrationWarning
        >
          {date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>
      {/* Match docs theme from Nextra */}
      <h1 className="!text-left !text-4xl sm:!text-5xl !my-6 nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100">
        {frontMatter.title}
      </h1>
      <h3 className="font-medium nx-text-2xl nx-text-slate-600">
        {frontMatter.title}
      </h3>
      {children}
      <div className="pt-8 mt-8 border-t">
        <Authors authors={frontMatter.authors.split(",")} />
      </div>
    </div>
  );
}
