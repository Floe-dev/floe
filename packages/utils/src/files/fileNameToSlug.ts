export const filenameToSlug = (filename: string) => {
  return filename
    .replace(".floe/", "")
    .replace("index.md", "")
    .replace(".md", "");
};
