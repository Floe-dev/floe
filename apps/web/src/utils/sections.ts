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

export function getFirstPageOfSections(sections: Sections) {
  if (!sections.length) return null;
  if (isPageView(sections[0])) return sections[0].pageView.path;
  if (isDataView(sections[0])) return sections[0].dataView.path;

  return getFirstPageOfSections(sections[0].pages);
}
