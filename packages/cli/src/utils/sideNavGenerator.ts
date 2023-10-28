import { capitalize } from "@floe/utils";

export function generateSideNav(files: string[], existingConfig = []) {
  return files.reduce((acc, file) => {
    const parts = file.split("/");
    // @ts-ignore
    const createPages = (pages: any[], parts: string[]) => {
      const [first, ...rest] = parts;
      const title = capitalize(first.replace(".md", ""));

      if (rest.length === 0) {
        return [
          ...pages,
          {
            title,
            pageView: {
              path: file.replace(".md", ""),
            },
          },
        ];
      }

      // First, check to see if the directory already exists
      const existingDirectory = pages.find(
        (page) => page.title === title && page.pages
      );

      return [
        ...pages.filter((page) => page.title !== title),
        {
          title,
          pages: createPages(existingDirectory?.pages ?? [], rest),
        },
      ];
    };

    return createPages(acc, parts);
  }, existingConfig);
}
