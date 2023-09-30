"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { generateURL } from "@/utils/generateURL";
import classNames from "classnames";
import { Project } from "@floe/next";
import { capitalize } from "@floe/utils";

type FileTreeNode = {
  slug: string;
  datasourceId: string;
};

type FileTree = {
  [key: string]: FileTree | FileTreeNode;
};

interface SideNavProps {
  // fileTree: FileTree;
  // fontSize?: "sm" | "lg";
  // subdomain: string;
  // slugWithBasePath: string;
  params: {
    subdomain: string;
    datasource: string;
    tab: string;
    path: string[];
  };
  currentDataSource: Project["datasources"][0];
}

const SideNav = ({ currentDataSource, params }: SideNavProps) => {
  const pathname = usePathname();

  const currentTab = currentDataSource.config.tabs.find(
    (t) => t.url === params.tab
  );

  return (
    <ul className={`w-full prose dark:prose-invert`}>
      {buildRecursiveTree(
        currentTab?.stack?.pages ?? [],
        params,
        currentDataSource.config.pageOptions,
        pathname
      )}
    </ul>
  );
};

const transformTitle = (
  path: string,
  pageOptions: {
    [key: string]: {
      title: string;
    };
  }
) => {
  if (pageOptions[path]) {
    return pageOptions[path].title;
  }

  const splitPath = path.split("/");
  return capitalize(splitPath[splitPath.length - 1]);
};

const buildRecursiveTree = (
  pages: (
    | string
    | {
        title: string;
        pages: any[];
      }
  )[],
  params: {
    subdomain: string;
    datasource: string;
    tab: string;
    path: string[];
  },
  pageOptions: {
    [key: string]: {
      title: string;
    };
  } = {},
  pathname: string
) => {
  return pages.map((page) => {
    if (typeof page === "string") {
      const isActive = [params.tab, ...params.path].join("/") === page;

      return (
        <li className="flex list-none rounded-lg prose-li">
          <Link
            href={generateURL(params.subdomain, params.datasource, "", page)}
            className={classNames(
              "flex flex-1 px-2 py-1 list-none rounded-lg prose-li font-normal no-underline",
              {
                "font-semibold text-primary-100 dark:text-primary-200 bg-primary-100/20 dark:bg-primary-200/20":
                  isActive,
              },
              {
                "font-normal dark:text-gray-200 text-gray-700 hover:bg-black/10 dark:hover:bg-white/20":
                  !isActive,
              }
            )}
          >
            {transformTitle(page, pageOptions)}
          </Link>
        </li>
      );
    }

    return (
      <Accordion.Root
        className="AccordionRoot"
        type="single"
        collapsible
        defaultValue={page.title}
        key={page.title}
      >
        <Accordion.Item className="AccordionItem" value={page.title}>
          <li className="my-6 list-none prose-li">
            {/* Section title */}
            <div
              className={classNames(
                "flex my-2 list-none rounded-lg prose-li",
                {
                  "bg-primary-100/20 dark:bg-primary-200/20": false,
                },
                {
                  "hover:bg-black/20 dark:hover:bg-white/20": false,
                }
              )}
            >
              <span className="flex-1 px-2 py-1 font-semibold">
                {page.title}
              </span>
              {page.pages && (
                <Accordion.Trigger className="px-2 group">
                  <ChevronRightIcon className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-90 w-4 h-4 ml-1" />
                </Accordion.Trigger>
              )}
            </div>

            {/* List */}
            <ul className="pl-4 my-0 border-l border-white/20 prose-ul">
              <Accordion.AccordionContent>
                {buildRecursiveTree(page.pages, params, pageOptions, pathname)}
              </Accordion.AccordionContent>
            </ul>
          </li>
        </Accordion.Item>
      </Accordion.Root>
    );
  });
};

// const buildRecursiveTree = (
//   ft: FileTree | FileTreeNode,
//   pathname: string,
//   subdomain: string,
//   slugWithBasePath: string
// ) => {
//   return Object.entries(ft).map(([key, value]) => {
//     const title = transformFileToTitle(key);

//     if (key === "index.md") {
//       return null;
//     }

//     if ((value as FileTreeNode).slug) {
//       const isNodeActive =
//         slugWithBasePath?.replace(/^\/|\/$/g, "") ===
//         (value as FileTreeNode).slug.replace(/^\/|\/$/g, "");

//       return (
//         <li
// className={classNames(
//   "flex my-2 list-none rounded-lg prose-li",
//   {
//     "bg-primary-100/20 dark:bg-primary-200/20": isNodeActive,
//   },
//   {
//     "hover:bg-black/10 dark:hover:bg-white/20": !isNodeActive,
//   }
// )}
//           key={key}
//         >
//           <Link
//             href={generateURL(subdomain, (value as FileTreeNode).slug)}
//             className={`flex-1 px-2 py-1 font-normal no-underline ${
//               isNodeActive
//                 ? "font-semibold text-primary-100 dark:text-primary-200"
//                 : "font-normal dark:text-gray-200 text-gray-700"
//             }`}
//           >
//             {title}
//           </Link>
//         </li>
//       );
//     }

//     const hasChildThatIsntIndex = Object.keys(value).some(
//       (v) => v !== "index.md"
//     );

//     const isSubdirectoryActive =
//       slugWithBasePath?.replace(/^\/|\/$/g, "") ===
//       ((value as FileTree)["index.md"]?.slug as string)?.replace(
//         /^\/|\/$/g,
//         ""
//       );

//     /**
//      * For rendering sub-directories and their children
//      */
//     return (
//       <Accordion.Root
//         className="AccordionRoot"
//         type="single"
//         collapsible
//         defaultValue={key}
//         key={key}
//       >
//         <Accordion.Item className="AccordionItem" value={key}>
//           <li className="m-0 list-none prose-li">
//             {/* Section title */}
//             <div
//               className={classNames(
//                 "flex my-2 list-none rounded-lg prose-li",
//                 {
//                   "bg-primary-100/20 dark:bg-primary-200/20":
//                     isSubdirectoryActive,
//                 },
//                 {
//                   "hover:bg-black/20 dark:hover:bg-white/20":
//                     !isSubdirectoryActive,
//                 }
//               )}
//             >
//               {(value as FileTree)["index.md"] ? (
//                 <Link
//                   href={generateURL(
//                     subdomain,
//                     (value as FileTree)["index.md"].slug as string
//                   )}
//                   className={`flex-1 px-2 py-1 no-underline ${
//                     isSubdirectoryActive
//                       ? "font-semibold text-primary-100 dark:text-primary-200"
//                       : "font-normal dark:text-gray-200 text-gray-700"
//                   }`}
//                 >
//                   {title}
//                 </Link>
//               ) : (
//                 <span className="flex-1 px-2 py-1 font-semibold">{title}</span>
//               )}
//               {hasChildThatIsntIndex && (
//                 <Accordion.Trigger className="px-2 group">
//                   <ChevronRightIcon className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-90 w-4 h-4 ml-1" />
//                 </Accordion.Trigger>
//               )}
//             </div>

//             {/* List */}
//             <ul className="pl-4 my-0 border-l border-white/20 prose-ul">
//               <Accordion.AccordionContent>
//                 {buildRecursiveTree(
//                   value,
//                   pathname,
//                   subdomain,
//                   slugWithBasePath
//                 )}
//               </Accordion.AccordionContent>
//             </ul>
//           </li>
//         </Accordion.Item>
//       </Accordion.Root>
//     );
//   });
// };

export default SideNav;
