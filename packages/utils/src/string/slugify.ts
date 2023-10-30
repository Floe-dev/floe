import s from "slugify";

export const slugify = (string: string) =>
  s(string, {
    lower: true,
    strict: true,
  });
