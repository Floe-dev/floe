"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { generateURL } from "@/utils/generateURL";
import classNames from "classnames";

type Tree = (
  | {
      title: string;
      pageView: {
        path: string;
      };
    }
  | {
      title: string;
      pages: Tree;
    }
  | {
      title: string;
      dataView: {
        path: string;
        direction: "dsc" | "asc";
      };
    }
)[];

interface SideNavProps {
  tree: Tree;
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  };
}

const SideNav = ({ tree, params }: SideNavProps) => {
  const pathname = usePathname();

  return (
    <ul className={`w-full prose dark:prose-invert p-0`}>
      {buildRecursiveTree(tree ?? [], params, pathname)}
    </ul>
  );
};

function isPageView(page: Tree[number]): page is {
  title: string;
  pageView: {
    path: string;
  };
} {
  return (
    (
      page as {
        title: string;
        pageView: {
          path: string;
        };
      }
    ).pageView !== undefined
  );
}

function isDataView(page: Tree[number]): page is {
  title: string;
  dataView: {
    path: string;
    direction: "dsc" | "asc";
  };
} {
  return (
    (
      page as {
        title: string;
        dataView: {
          path: string;
          direction: "dsc" | "asc";
        };
      }
    ).dataView !== undefined
  );
}

const renderItem = (
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  },
  path: string,
  title: string
) => {
  const isActive = (params?.path ?? []).join("/") === path;

  return (
    <li className="flex p-0 list-none rounded-lg" key={path}>
      <Link
        href={generateURL(params.subdomain, params.datasource, "", path)}
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
        {title}
      </Link>
    </li>
  );
};

const buildRecursiveTree = (
  pages: Tree,
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  },
  pathname: string
) => {
  return pages.map((page) => {
    if (isPageView(page)) {
      return renderItem(params, page.pageView.path, page.title);
    }

    if (isDataView(page)) {
      return renderItem(params, page.dataView.path, page.title);
    }

    if (!page.pages) {
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
                {buildRecursiveTree(page.pages, params, pathname)}
              </Accordion.AccordionContent>
            </ul>
          </li>
        </Accordion.Item>
      </Accordion.Root>
    );
  });
};

export default SideNav;
