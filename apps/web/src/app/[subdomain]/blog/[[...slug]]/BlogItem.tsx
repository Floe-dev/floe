"use client";

import React from "react";
import { PostPrimitive } from "@floe/next";
import type { RenderedPostContent } from "@floe/next";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const Blog = ({ blog }: { blog: RenderedPostContent }) => (
  <div className="flex flex-col gap-0 prose md:gap-4 md:flex-row dark:prose-invert">
    <PostPrimitive.Root post={blog}>
      {/* DATE */}
      <PostPrimitive.Date className="w-40 mt-6 font-normal leading-8 text-gray-500 dark:text-gray-400" />

      <div className="flex-1 col-span-3 rounded-none md:rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] -mx-8 md:mx-0 overflow-hidden p-8 md:p-6">
        {/* TITLE */}
        <PostPrimitive.Title className="mt-0 mb-0 prose-lg" />

        {/* CONTENT */}
        <PostPrimitive.Content className="mt-0 overflow-hidden font-normal prose-base prose-zinc max-h-40" />
        <p className="flex items-center mb-0 transition ease-in text-primary-100 dark:text-primary-200 hover:translate-x-1">
          Continue reading <ChevronRightIcon className="w-5 h-5" />
        </p>
      </div>
    </PostPrimitive.Root>
  </div>
);

export default Blog;
