"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { generateURL } from "@/utils/generateURL";
import classNames from "classnames";
import { Project } from "@floe/next";
import { capitalize } from "@floe/utils";

interface SideNavProps {
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

  const currentTab = currentDataSource.config.sections.find(
    (t: any) => t.url === params.tab
  );

  return (
    <ul className={`w-full prose dark:prose-invert p-0`}>
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
      const isActive = [params.tab, ...(params?.path ?? [])].join("/") === page;

      return (
        <li className="flex p-0 list-none rounded-lg" key={page}>
          <Link
            href={generateURL(params.subdomain, params.datasource, "", page)}
            className={classNames(
              "flex flex-1 px-2 py-1 rounded-lg font-normal no-underline",
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

    if (!page.pages.length) {
      return null;
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
          <li className="p-0 my-6 list-none">
            <Accordion.Trigger className="flex items-center w-full px-2 py-1 text-left rounded-lg group hover:bg-black/10 dark:hover:bg-white/20">
              <span className="flex-1 font-semibold">{page.title}</span>
              <ChevronRightIcon className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-90 w-4 h-4 ml-1" />
            </Accordion.Trigger>

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

export default SideNav;
