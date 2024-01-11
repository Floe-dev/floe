"use client";

import { useEffect, useState, useCallback } from "react";

const TITLE = "Write Docs\n That Scale.\n Automatically.";

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
      className={`relative inline-block w-min mt-2 text-6xl font-garamond text-zinc-900 sm:text-7xl ${
        text.length === 0 ? "" : "after:ml-4"
      }`}
    >
      <span aria-hidden className="invisible">
        {TITLE}
      </span>
      <span
        className={`absolute top-0 left-0 after:absolute sm:after:h-14 sm:after:w-7 after:h-12 after:w-6 after:bg-zinc-900 after:mt-2 after:animate-pulse ${
          isDone ? "after:hidden" : ""
        } ${text.length === 0 ? "" : "after:ml-4"}`}
      >
        {text}
      </span>
    </h1>
  );
}
