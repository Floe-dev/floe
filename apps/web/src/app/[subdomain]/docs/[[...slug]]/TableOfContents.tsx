"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

type FileTreeNode = {
  filename: string;
  datasourceId: string;
};

type FileTree = {
  [key: string]: FileTree | FileTreeNode;
};

interface TableOfContentsProps {
  fileTree: FileTree;
  fontSize?: "sm" | "lg";
}

const TableOfContents = ({
  fileTree,
  fontSize = "sm",
}: TableOfContentsProps) => {
  const pathname = usePathname();

  return (
    <ul
      className={`w-full prose dark:prose-invert ${
        fontSize === "sm" ? "prose-sm" : "prose-lg"
      }`}
    >
      {buildRecursiveTree(fileTree, pathname)}
    </ul>
  );
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const transformFileToTitle = (filename: string) => {
  const array = filename.replace(".md", "").split("-");

  /**
   * Remove first item if it's a number
   */
  if (array[0]) {
    const firstItem = array[0];
    const firstItemAsNumber = Number(firstItem);

    if (!isNaN(firstItemAsNumber)) {
      array.shift();
    }
  }

  return array.map((item) => capitalize(item)).join(" ");
};

const buildRecursiveTree = (ft: FileTree | FileTreeNode, pathname: string) => {
  return Object.entries(ft).map(([key, value]) => {
    const title = transformFileToTitle(key);

    if (key === "index.md") {
      return null;
    }

    if ((value as FileTreeNode).filename) {
      return (
        <li
          className="flex my-2 list-none rounded-lg prose-li hover:bg-white/20"
          key={key}
        >
          <Link
            href={"/" + (value as FileTreeNode).filename}
            className={`flex-1 px-2 py-1 font-normal no-underline ${
              decodeURIComponent(pathname).includes(value.filename)
                ? "font-semibold text-white"
                : "font-normal text-gray-200"
            }`}
          >
            {title}
          </Link>
        </li>
      );
    }

    const hasChildThatIsntIndex = Object.keys(value).some(
      (v) => v !== "index.md"
    );

    return (
      <Accordion.Root
        className="AccordionRoot"
        type="single"
        collapsible
        defaultValue={key}
        key={key}
      >
        <Accordion.Item className="AccordionItem" value={key}>
          <li className="m-0 list-none prose-li">
            {/* Section title */}
            <div className="flex justify-between my-2 rounded-lg hover:bg-white/20">
              {(value as FileTree)["index.md"] ? (
                <Link
                  href={
                    ("/" + (value as FileTree)["index.md"].filename) as string
                  }
                  className={`flex-1 px-2 py-1 no-underline ${
                    decodeURIComponent(pathname).includes(
                      (value as FileTree)["index.md"].filename as string
                    )
                      ? "font-semibold text-white"
                      : "font-normal text-gray-200"
                  }`}
                >
                  {title}
                </Link>
              ) : (
                <span className="flex-1 px-2 py-1 font-semibold">{title}</span>
              )}
              {hasChildThatIsntIndex && (
                <Accordion.Trigger className="px-2 group">
                  <ChevronRightIcon className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-90 w-4 h-4 ml-1" />
                </Accordion.Trigger>
              )}
            </div>

            {/* List */}
            <ul className="pl-4 my-0 border-l border-white/20 prose-ul">
              <Accordion.AccordionContent>
                {buildRecursiveTree(value, pathname)}
              </Accordion.AccordionContent>
            </ul>
          </li>
        </Accordion.Item>
      </Accordion.Root>
    );
  });
};

export default TableOfContents;
