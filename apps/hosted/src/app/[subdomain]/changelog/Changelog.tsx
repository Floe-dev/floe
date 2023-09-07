"use client";

import React from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
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

const Changelog = ({ changelog }: { changelog: RenderedPostContent }) => (
  <PostPrimitive.Root post={changelog}>
    <div className="relative pb-16 mb-20 border-b last:mb-0 last:pb-0 last:border-0 border-zinc-700">
      {/* DATE */}
      <PostPrimitive.Date className="text-gray-400" />

      {/* IMAGE */}
      <PostPrimitive.Image className="relative w-full h-56 m-0 mt-2 overflow-hidden md:h-96 rounded-xl">
        <PostPrimitive.ImagePlaceholder className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-700 animate-pulse">
          <PhotoIcon className="w-10 h-10 text-gray-400" />
        </PostPrimitive.ImagePlaceholder>
        <PostPrimitive.ImageError className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-700">
          <PhotoIcon className="w-10 h-10 text-gray-400" />
        </PostPrimitive.ImageError>
      </PostPrimitive.Image>

      {/* TITLE */}
      <PostPrimitive.Title />

      {/* CONTENT */}
      <PostPrimitive.Content />

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

export default Changelog;
