import { Sections } from "@floe/next";

export function isPageView(page: Sections[number]): page is {
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

export function isDataView(page: Sections[number]): page is {
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

export function getFirstPageOfSections(tree: Sections) {
  if (!tree.length) return null;
  if (isPageView(tree[0])) return tree[0].pageView.path;
  if (isDataView(tree[0])) return tree[0].dataView.path;

  return getFirstPageOfSections(tree[0].pages);
}
