"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { generateURL } from "@/utils/generateURL";
import classNames from "classnames";

type FileTreeNode = {
  slug: string;
  datasourceId: string;
};

type FileTree = {
  [key: string]: FileTree | FileTreeNode;
};

interface SideNavProps {
  fileTree: FileTree;
  fontSize?: "sm" | "lg";
  subdomain: string;
  slugWithBasePath: string;
}

const SideNav = ({
  fileTree,
  fontSize = "sm",
  subdomain,
  slugWithBasePath,
}: SideNavProps) => {
  const pathname = usePathname();

  return (
    <ul
      className={`w-full prose dark:prose-invert ${
        fontSize === "sm" ? "prose-sm" : "prose-lg"
      }`}
    >
      {buildRecursiveTree(fileTree, pathname, subdomain, slugWithBasePath)}
    </ul>
  );
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const transformFileToTitle = (slug: string) => {
  const array = slug.replace(".md", "").split("-");

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

const buildRecursiveTree = (
  ft: FileTree | FileTreeNode,
  pathname: string,
  subdomain: string,
  slugWithBasePath: string
) => {
  return Object.entries(ft).map(([key, value]) => {
    const title = transformFileToTitle(key);

    if (key === "index.md") {
      return null;
    }

    if ((value as FileTreeNode).slug) {
      const isNodeActive =
        slugWithBasePath?.replace(/^\/|\/$/g, "") ===
        (value as FileTreeNode).slug.replace(/^\/|\/$/g, "");

      return (
        <li
          className={classNames(
            "flex my-2 list-none rounded-lg prose-li",
            {
              "bg-primary-100/20 dark:bg-primary-200/20": isNodeActive,
            },
            {
              "hover:bg-black/10 dark:hover:bg-white/20": !isNodeActive,
            }
          )}
          key={key}
        >
          <Link
            href={generateURL(subdomain, (value as FileTreeNode).slug)}
            className={`flex-1 px-2 py-1 font-normal no-underline ${
              isNodeActive
                ? "font-semibold text-primary-100 dark:text-primary-200"
                : "font-normal dark:text-gray-200 text-gray-700"
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

    const isSubdirectoryActive =
      slugWithBasePath?.replace(/^\/|\/$/g, "") ===
      ((value as FileTree)["index.md"]?.slug as string)?.replace(
        /^\/|\/$/g,
        ""
      );

    /**
     * For rendering sub-directories and their children
     */
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
            <div
              className={classNames(
                "flex my-2 list-none rounded-lg prose-li",
                {
                  "bg-primary-100/20 dark:bg-primary-200/20":
                    isSubdirectoryActive,
                },
                {
                  "hover:bg-black/20 dark:hover:bg-white/20":
                    !isSubdirectoryActive,
                }
              )}
            >
              {(value as FileTree)["index.md"] ? (
                <Link
                  href={generateURL(
                    subdomain,
                    (value as FileTree)["index.md"].slug as string
                  )}
                  className={`flex-1 px-2 py-1 no-underline ${
                    isSubdirectoryActive
                      ? "font-semibold text-primary-100 dark:text-primary-200"
                      : "font-normal dark:text-gray-200 text-gray-700"
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
                {buildRecursiveTree(
                  value,
                  pathname,
                  subdomain,
                  slugWithBasePath
                )}
              </Accordion.AccordionContent>
            </ul>
          </li>
        </Accordion.Item>
      </Accordion.Root>
    );
  });
};

export default SideNav;
