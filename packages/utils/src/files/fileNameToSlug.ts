export const filenameToSlug = (filename: string) => {
  return filename.replace(".md", "");
};

export const slugToFilename = (slug: string) => {
  return slug + ".md";
};
