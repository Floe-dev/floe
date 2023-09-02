"use client";

import React from "react";
import { PostPrimitive } from "@floe/next";
import type { RenderedPostContent } from "@floe/next";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const Blog = ({ blog }: { blog: RenderedPostContent }) => (
  <PostPrimitive.Root post={blog}>
    <div className="relative flex flex-col gap-4 mb-4 -mt-8 prose no-underline border-b md:flex-row last:pb-0 last:border-0 border-zinc-700 dark:prose-invert">
      {/* DATE */}
      <PostPrimitive.Date className="w-40 mt-6 font-normal leading-8 text-gray-400" />

      <div className="flex-1 col-span-3 p-8 md:p-6 rounded-none md:rounded-lg hover:bg-white/[0.04] -mx-8 md:mx-0">
        {/* TITLE */}
        <PostPrimitive.Title className="mt-0 mb-0 prose-lg" />

        {/* CONTENT */}
        <PostPrimitive.Content className="mt-0 overflow-hidden font-normal prose-base prose-zinc max-h-40" />
        <p className="flex items-center mb-0 text-indigo-500 transition ease-in hover:translate-x-1">
          Continue reading <ChevronRightIcon className="w-5 h-5" />
        </p>
      </div>
    </div>
  </PostPrimitive.Root>
);

export default Blog;
