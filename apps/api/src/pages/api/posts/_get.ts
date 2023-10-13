import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/privateMiddleware";
import {
  Octokit,
  filenameToSlug,
  getFileTree,
  getRepositoryContent,
  getUser,
  slugToFilename,
} from "@floe/utils";
import { Markdoc, markdocConfig } from "@floe/markdoc";
import { z } from "zod";
import yaml from "js-yaml";
import { DataSource } from "@floe/db";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

async function handler(
  { query, project, octokit }: NextApiRequestExtension,
  res: NextApiResponseExtension
) {
  const { path = "", datasourceSlug } = query as {
    path?: string;
    datasourceSlug?: string;
  };

  if (!datasourceSlug) {
    return res.status(400).json({
      error: {
        message: "datasourceSlug parameter is required",
      },
    });
  }

  let content;

  const datasource = project.datasources.find(
    (d) => d.slug === datasourceSlug
  ) as DataSource;

  const imagesVersion = "v1";
  const baseURL =
    process.env.NEXT_PUBLIC_FLOE_BASE_URL ?? "https://api.floe.dev/";
  const imageBasePath = `${baseURL}${imagesVersion}/images?slug=${project.slug}&datasourceId=${datasource.id}`;

  try {
    const posts = await getFileTree(octokit, {
      owner: datasource.owner,
      repo: datasource.repo,
      ref: datasource.baseBranch,
      rules: [`${path}/*.md`, `${path}.md`],
    });

    content = Promise.all(
      posts.map(async (post) => {
        return generatePostContent(
          // @ts-ignore
          octokit,
          datasource,
          post,
          imageBasePath
        );
      })
    );
  } catch (e: any) {
    return res.status(400).json({
      error: e.message,
    });
  }

  const response = await getRepositoryContent(octokit, {
    owner: datasource.owner,
    repo: datasource.repo,
    path: `.floe/config.json`,
    ref: datasource.baseBranch,
  });

  const config = JSON.parse(response);

  content = (await content).flat();

  const node = content.find((c) => c && c.filename === slugToFilename(path));

  if (node) {
    return {
      data: node,
    };
  }

  // const section = config.sections.find((s: any) => s.url === path);

  // const sortedContent = content.flat().sort((a, b) => {
  //   const orderDirection = section.list?.direction === "dsc" ? 1 : -1;

  //   return new Date(a?.metadata.date) < new Date(b?.metadata.date)
  //     ? 1 * orderDirection
  //     : -1 * orderDirection;
  // });

  return { data: content.flat() };
}

/**
 * Fetch content from GitHub Content API
 * Parse file content with Markdoc
 * Transform Markdoc
 * Add metadata
 * Return content
 */
async function generatePostContent(
  octokit: Octokit,
  datasource: DataSource,
  post: string,
  imageBasePath: string
) {
  /**
   * TODO: This can be optimized to only make one API call per datasource
   */
  const fileContent = await getRepositoryContent(octokit, {
    owner: datasource.owner,
    repo: datasource.repo,
    path: post,
    ref: datasource.baseBranch,
  });

  /**
   * API data transformations:
   * - Get image path
   * - Get deploy date (TODO)
   * - ...
   */
  const ast = Markdoc.parse(fileContent);
  const metadata = (
    ast.attributes.frontmatter ? yaml.load(ast.attributes.frontmatter) : {}
  ) as any;

  /**
   * Replace image paths with absolute API path
   */
  if (metadata.image && metadata.image.startsWith("/")) {
    metadata.image = encodeURI(`${imageBasePath}&filename=${metadata.image}`);
  }

  /**
   * Generate human-friendly date
   */
  if (metadata.date && z.date().safeParse(metadata.date).success) {
    metadata.date = new Date(metadata.date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Get author data
   */
  if (metadata.authors) {
    const authors = await Promise.all(
      metadata.authors.map(async (author: string) => {
        const user = await getUser(octokit, {
          username: author,
        });

        if (!user) {
          return;
        }

        return {
          name: user.name,
          username: user.login,
          avatar: user.avatar_url,
        };
      })
    );

    metadata.authors = authors.filter((a) => a);
  }

  const transform = Markdoc.transform(ast, markdocConfig);

  return {
    owner: datasource.owner,
    repo: datasource.repo,
    datasourceId: datasource.id,
    imageBasePath,
    filename: post,
    metadata,
    transform,
    slug: filenameToSlug(post),
  };
}

export default defaultResponder(handler);
