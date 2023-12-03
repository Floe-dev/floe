"use client";

import { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

export function Clipboard({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button className={className} onClick={() => copyToClipboard()}>
      {!copied ? (
        <ClipboardDocumentIcon className="w-5 h-5 text-gray-400 animate-fade-in" />
      ) : (
        <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-500 animate-fade-in" />
      )}
    </button>
  );
}
