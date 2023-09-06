export const filenameToSlug = (filename: string) => {
  return filename.replace(".floe/", "");
};

export const slugToFilename = (slug: string) => ".floe/" + slug;
