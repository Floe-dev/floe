import { Tree } from "@floe/next";

export function isPageView(page: Tree[number]): page is {
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

export function isDataView(page: Tree[number]): page is {
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

export function getFirstPageOfTree(tree: Tree) {
  if (!tree.length) return null;
  if (isPageView(tree[0])) return tree[0].pageView.path;
  if (isDataView(tree[0])) return tree[0].dataView.path;

  return getFirstPageOfTree(tree[0].pages);
}
