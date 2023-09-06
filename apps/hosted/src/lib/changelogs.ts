// import fs from "fs";
// import path from "path";
// import yaml from "js-yaml";
import { ReactNode } from "react";

export type Changelog = {
  title: string;
  date: Date;
  image: string;
  content: ReactNode;
}

// // CHANGELOG_PATH is useful when you want to get the path to a specific file
// export const BLOG_PATH = path.join(process.cwd(), "../..", ".floe", "blog");
// export const CHANGELOG_PATH = path.join(
//   process.cwd(),
//   "../..",
//   ".floe",
//   "changelog"
// );

// const PATHS = {
//   blog: BLOG_PATH,
//   changelog: CHANGELOG_PATH,
// };

// export const getMDFiles = async (type: "blog" | "changelog") => {
//   const changelogFilePaths = fs
//     .readdirSync(PATHS[type])
//     // Only include md files
//     .filter((path) => /\.md?$/.test(path));

//   return changelogFilePaths.map((filePath) => {
//     const source = fs.readFileSync(path.join(PATHS[type], filePath), "utf-8");
//     const ast = Markdoc.parse(source);
//     const content = Markdoc.transform(ast);
//     const data = (ast.attributes.frontmatter
//       ? yaml.load(ast.attributes.frontmatter)
//       : {}) as Changelog;

//     return {
//       content,
//       data,
//       filePath,
//     };
//   });
// };

// export const getMDFile = async (
//   type: "blog" | "changelog",
//   filename: string
// ) => {
//   const files = await getMDFiles(type);
//   const file = files.find((changelog) => changelog.filePath === filename);

//   if (!file) {
//     return;
//   }

//   return {
//     ...file,
//     mdxSource: file.content,
//   };
// };
