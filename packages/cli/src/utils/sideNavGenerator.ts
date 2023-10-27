import { capitalize } from "@floe/utils";

export function generateSideNav(files: string[], existingConfig = []) {
  return files.reduce((acc, file) => {
    const parts = file.split("/");
    // @ts-ignore
    const createPages = (pages: any[], parts: string[], depth = 0) => {
      const [first, ...rest] = parts;
      const title = capitalize(first.replace(".md", ""));
      /**
       * If page already exists, add to it
       */
      const existingPage = pages.find(
        (page) => page.title === title && page.pages
      );
      if (existingPage) {
        existingPage.pages.push(
          createPages(existingPage.pages, rest, depth + 1)
        );
        return pages;
      }
      // @ts-ignore
      const page =
        /**
         * If page is a leaf node, return a pageView. If not, return a page with pages
         */
        rest.length === 0
          ? {
              title,
              pageView: {
                path: file.replace(".md", ""),
              },
            }
          : {
              title,
              pages: [createPages([], rest, depth + 1)],
            };
      /**
       * If we are at the root, return the pages array
       */
      if (depth === 0) {
        return [...pages, page];
      }
      return page;
    };
    return createPages(acc, parts);
  }, existingConfig);
}
