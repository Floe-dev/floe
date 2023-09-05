import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/middleware";
import {
  Markdoc,
  markdocConfig,
  Octokit,
  filenameToSlug,
  getFileTree,
  getRepositoryContent,
  getUser,
} from "@floe/utils";
import { z } from "zod";
import yaml from "js-yaml";
import { prisma } from "@/lib/db/client";
import { DataSource, Post } from "@floe/db";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

async function handler(
  { query, project, octokit, keyId }: NextApiRequestExtension,
  res: NextApiResponseExtension
) {
  const { path } = query as { path?: string };

  if (!path) {
    return res.status(400).json({
      error: {
        message: "path parameter is required",
      },
    });
  }

  const contents = Promise.all(
    project.datasources.map(async (datasource) => {
      const baseURL =
        process.env.NEXT_PUBLIC_FLOE_BASE_URL ?? "https://app.floe.dev/api/";
      const imageBasePath = `${baseURL}images?id=${project.apiKeyId}&did=${datasource.id}`;

      try {
        const files = await getFileTree(octokit, {
          owner: datasource.owner,
          repo: datasource.repo,
          ref: datasource.baseBranch,
          rules: [`.floe/${path}/*`, `.floe/${path}`, `.floe/${path}/index.md`],
        });

        const posts = await prisma.post.findMany({
          where: {
            filename: {
              in: files,
            },
            datasourceId: datasource.id,
            datasource: {
              project: {
                apiKeyId: keyId,
              },
            },
          },
        });

        return Promise.all(
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
    })
  );

  const content = (await contents).flat(2);

  const indexPost = content.find((c) => c && c.fileName.includes("index.md"));
  const isNode = indexPost || path.endsWith(".md");

  // if multiple files are returned for a "node", return the first one
  // (and later the one matching the default data source)
  if (isNode) {
    return {
      data: indexPost || content[0],
    };
  }

  const sortedContent = content.sort((a, b) =>
    new Date(a?.metadata.date) < new Date(b?.metadata.date) ? 1 : -1
  );

  return { data: sortedContent };
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
  post: Post,
  imageBasePath: string
) {
  /**
   * TODO: This can be optimized to only make one API call per datasource
   */
  const fileContent = await getRepositoryContent(octokit, {
    owner: datasource.owner,
    repo: datasource.repo,
    path: post.filename,
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
    metadata.image = encodeURI(`${imageBasePath}&fn=${metadata.image}`);
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
    fileName: post.filename,
    metadata,
    transform,
    slug: filenameToSlug(post.filename),
  };
}

export default defaultResponder(handler);
