"use client";

import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const CodeBlock = ({
  children,
  lang = "javascript",
}: {
  children: string;
  lang?: string;
}) => (
  <SyntaxHighlighter
    language={lang}
    customStyle={{
      padding: "1rem",
    }}
    style={nightOwl}
  >
    {children}
  </SyntaxHighlighter>
);
