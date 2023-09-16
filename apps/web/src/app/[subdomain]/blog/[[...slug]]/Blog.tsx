"use client";

import React from "react";
import { PhotoIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { PostPrimitive } from "@floe/next";
import type { RenderedPostContent } from "@floe/next";
import {
  FaceSmileIcon,
  FaceFrownIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import {
  FaceSmileIcon as FaceSmileIconSolid,
  FaceFrownIcon as FaceFrownIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid,
} from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";

const reactions: {
  type: keyof PostPrimitive.ReactionsProps["reactions"];
  selectedIcon: JSX.Element;
  unselectedIcon: JSX.Element;
}[] = [
  {
    type: "HOORAY",
    selectedIcon: <RocketLaunchIconSolid className="w-5 h-5 text-gray-400" />,
    unselectedIcon: <RocketLaunchIcon className="w-5 h-5 text-gray-400" />,
  },
  {
    type: "THUMBS_UP",
    selectedIcon: <FaceSmileIconSolid className="w-5 h-5 text-gray-400" />,
    unselectedIcon: <FaceSmileIcon className="w-5 h-5 text-gray-400" />,
  },
  {
    type: "THUMBS_DOWN",
    selectedIcon: <FaceFrownIconSolid className="w-5 h-5 text-gray-400" />,
    unselectedIcon: <FaceFrownIcon className="w-5 h-5 text-gray-400" />,
  },
];

const Blog = ({ blog }: { blog: RenderedPostContent }) => {
  const router = useRouter();
  const pathname = usePathname();
  const newPath = pathname.split("/").slice(0, -1).join("/");

  return (
    <PostPrimitive.Root post={blog}>
      <button
        type="button"
        onClick={() => router.push(newPath)}
        className="flex items-center mb-2 transition ease-in text-primary-100 dark:text-primary-200 hover:-translate-x-1"
      >
        <ChevronLeftIcon className="w-6 h-6 mr-1" /> Back
      </button>
      <div className="w-full">
        {/* DATE */}
        <PostPrimitive.Date className="mt-8 text-gray-500 dark:text-gray-400" />

        <div className="flex flex-col gap-4 my-8">
          {/* TITLE */}
          <PostPrimitive.Title className="my-0 text-4xl" />

          {/* SUBTITLE */}
          <PostPrimitive.SubTitle className="my-0 text-xl font-normal text-gray-700 dark:text-gray-300" />
        </div>

        {/* IMAGE */}
        <PostPrimitive.Image className="relative w-full h-56 m-0 mt-2 overflow-hidden md:h-96 rounded-xl">
          <PostPrimitive.ImagePlaceholder className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-700 animate-pulse">
            <PhotoIcon className="w-10 h-10 text-gray-400" />
          </PostPrimitive.ImagePlaceholder>
          <PostPrimitive.ImageError className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-700">
            <PhotoIcon className="w-10 h-10 text-gray-400" />
          </PostPrimitive.ImageError>
        </PostPrimitive.Image>

        {/* CONTENT */}
        <PostPrimitive.Content className="mt-8 prose-base prose-zinc dark:prose-invert" />

        {blog.metadata.authors?.length > 0 && (
          <div className="my-8">
            <h6 className="mb-2 text-sm text-gray-400">Written by</h6>
            <div className="flex gap-8">
              {blog.metadata.authors?.map((author) => (
                <PostPrimitive.Author
                  author={author}
                  key={author.name}
                  className="flex items-center gap-4"
                >
                  <PostPrimitive.AuthorAvatar className="relative w-10 h-10 overflow-hidden rounded-full" />
                  <PostPrimitive.AuthorName className="text-gray-300" />
                </PostPrimitive.Author>
              ))}
            </div>
          </div>
        )}

        {/* REACTIONS */}
        <PostPrimitive.Reactions className="flex items-center justify-center">
          {reactions.map(({ type, selectedIcon, unselectedIcon }) => (
            <PostPrimitive.Reaction type={type} key={type}>
              <PostPrimitive.ReactionTrigger className="group flex items-center gap-1.5 rounded-lg hover:bg-gray-800 px-2 py-1 cursor-pointer">
                <div className="transition-transform group-active:scale-[0.85] ease-in-out duration-75">
                  <PostPrimitive.ReactionSelectedIcon>
                    {selectedIcon}
                  </PostPrimitive.ReactionSelectedIcon>
                  <PostPrimitive.ReactionUnselectedIcon>
                    {unselectedIcon}
                  </PostPrimitive.ReactionUnselectedIcon>
                </div>
                <PostPrimitive.ReactionCount />
              </PostPrimitive.ReactionTrigger>
            </PostPrimitive.Reaction>
          ))}
        </PostPrimitive.Reactions>
      </div>
    </PostPrimitive.Root>
  );
};

export default Blog;
