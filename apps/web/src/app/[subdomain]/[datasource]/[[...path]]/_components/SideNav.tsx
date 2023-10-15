"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { generateURL } from "@/utils/generateURL";
import classNames from "classnames";
import Image from "next/image";
import { Project, Datasource, Sections } from "@floe/next";
import { DatasourceSelector } from "./DatasourceSelector";
import { isPageView, isDataView } from "@/utils/tree";

interface SideNavProps {
  project: Project;
  datasource: Datasource;
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  };
}

const SideNav = ({ project, datasource, params }: SideNavProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Link href={project.homepageURL ?? ""} className="hidden px-2 lg:block">
          {project.logo ? (
            <Image
              priority
              src={project.logo}
              width="0"
              height="0"
              sizes="100vw"
              className="w-auto h-6 dark:invert"
              alt="Follow us on Twitter"
            />
          ) : (
            <h1 className="text-black dark:text-white">{project.name}</h1>
          )}
        </Link>
        <DatasourceSelector project={project} datasource={datasource} />
      </div>

      <ul className="w-full p-0 mt-8 text-lg prose lg:text-sm dark:prose-invert">
        {buildRecursiveTree(datasource.sections ?? [], params)}
      </ul>
    </>
  );
};

const renderItem = (
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  },
  path: string,
  title: string,
  stayActiveForChildren = false
) => {
  const joinedPath = (params?.path ?? []).join("/");
  const isActive =
    joinedPath === path ||
    (stayActiveForChildren && joinedPath.startsWith(path));

  return (
    <li className="flex p-0 text-lg list-none rounded-lg lg:text-sm" key={path}>
      <Link
        href={generateURL(params.subdomain, params.datasource, path)}
        className={classNames(
          "flex flex-1 px-2 py-1 rounded-lg font-normal no-underline",
          {
            "font-semibold text-primary-100 dark:text-primary-200 bg-primary-100/20 dark:bg-primary-200/20":
              isActive,
          },
          {
            "font-normal dark:text-gray-300 text-gray-600 hover:bg-black/5 dark:hover:bg-white/10":
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
  pages: Sections,
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  }
) => {
  return pages.map((page) => {
    if (isPageView(page)) {
      return renderItem(params, page.pageView.path, page.title);
    }

    if (isDataView(page)) {
      return renderItem(params, page.dataView.path, page.title, true);
    }

    if (!page.pages) {
      return null;
    }

    const defaultOpen = (p: Sections): boolean =>
      p.some((page) => {
        const path = (params?.path ?? []).join("/");

        if (isPageView(page)) {
          return page.pageView.path.includes(path);
        }

        if (isDataView(page)) {
          return page.dataView.path.includes(path);
        }

        if (page.pages) {
          return defaultOpen(page.pages);
        }

        return false;
      });

    return (
      <Accordion.Root
        className="AccordionRoot"
        type="single"
        collapsible
        defaultValue={defaultOpen(page.pages) && page.title}
        key={page.title}
      >
        <Accordion.Item className="AccordionItem" value={page.title}>
          <li className="p-0 list-none">
            <Accordion.Trigger className="flex items-center w-full px-2 py-1 text-left rounded-lg group hover:bg-black/5 dark:hover:bg-white/10">
              <span className="flex-1 text-gray-600 dark:text-gray-300">
                {page.title}
              </span>
              <ChevronRightIcon className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-90 w-6 h-6 lg:w-4 lg:h-4 ml-1" />
            </Accordion.Trigger>

            <ul className="pl-4 my-0prose-ul">
              <Accordion.AccordionContent>
                {buildRecursiveTree(page.pages, params)}
              </Accordion.AccordionContent>
            </ul>
          </li>
        </Accordion.Item>
      </Accordion.Root>
    );
  });
};

export default SideNav;
