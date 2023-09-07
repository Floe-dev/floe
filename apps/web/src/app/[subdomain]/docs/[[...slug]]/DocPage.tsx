"use client";

import React from "react";
import { PostPrimitive } from "@floe/next";
import type { RenderedPostContent } from "@floe/next";

const DocPage = ({ doc }: { doc: RenderedPostContent }) => (
  <PostPrimitive.Root post={doc}>
    <div className="relative mb-4 prose no-underline border-b last:pb-0 last:border-0 border-zinc-700 dark:prose-invert">
      {/* TITLE */}
      <PostPrimitive.Title className="mt-0 text-4xl" />

      {/* CONTENT */}
      <PostPrimitive.Content className="font-normal prose-base prose-zinc dark:prose-invert" />
    </div>
  </PostPrimitive.Root>
);

export default DocPage;
