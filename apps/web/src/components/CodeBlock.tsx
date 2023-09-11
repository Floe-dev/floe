"use client";

import { Clipboard } from "@floe/ui";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const CodeBlock = ({
  children,
  language = "javascript",
}: {
  children: string;
  language?: string;
}) => (
  <div className="relative">
    <SyntaxHighlighter
      language={language}
      customStyle={{
        padding: "1rem",
      }}
      style={nightOwl}
    >
      {children}
    </SyntaxHighlighter>
    <Clipboard text={children} className="absolute top-4 right-4" />
  </div>
);
