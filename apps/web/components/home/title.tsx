"use client";

import { useEffect, useState, useCallback } from "react";

const TITLE = "Write Docs That Scale. Automatically.";

export function Title() {
  const [text, setText] = useState("");

  const typeWriter = useCallback((i: number) => {
    const speed = 25 + Math.floor(Math.random() * 100);

    if (i < TITLE.length) {
      setText((prev) => prev + TITLE.charAt(i));
      setTimeout(() => {
        typeWriter(i + 1);
      }, speed);
    }
  }, []);

  useEffect(() => {
    if (TITLE !== text) {
      setTimeout(() => {
        typeWriter(0);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Including text here will cause an infinite loop
  }, [typeWriter]);

  const isDone = text.length === TITLE.length;

  return (
    <h1
      className={`pr-8 min-h-[180px] sm:min-h-[216px] sm:max-w-[400px] mt-2 text-6xl font-garamond text-zinc-900 sm:text-7xl after:absolute sm:after:h-14 sm:after:w-7 after:h-12 after:w-6 after:bg-zinc-900 after:mt-2 after:animate-pulse ${
        isDone ? "after:hidden" : ""
      } ${text.length === 0 ? "" : "after:ml-4"}`}
    >
      {text}
    </h1>
  );
}
