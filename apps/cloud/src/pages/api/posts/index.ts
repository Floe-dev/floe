import type { NextApiRequest, NextApiResponse } from "next";
import yaml from "js-yaml";
import bcrypt from "bcrypt";
import { Octokit } from "octokit";
import { prisma } from "@/server/db/client";
import { createAppAuth } from "@octokit/auth-app";
import { getUser } from "@/server/shared/get-user";
import { getRepositoryContent } from "@/server/shared/get-repo-contents";
import Markdoc from "@markdoc/markdoc";
import { z } from "zod";
import { getFileTree } from "@/server/shared/get-file-tree";
import { filenameToSlug } from "@/utils/postSlug";
import { DataSource, Post } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: {
        message: "Method not allowed",
      },
    });
  }

  const query = req.query as { path: string; datasourceId?: string };
  const { path, datasourceId } = query;

  const keyId = req.headers["x-api-id"] as string | undefined;
  const key = req.headers["x-api-key"] as string | undefined;

  if (!path || !key) {
    return res.status(400).json({
      error: {
        message: "Missing required query parameters",
      },
    });
  }

  const project = await prisma.project.findUnique({
    where: {
      apiKeyId: keyId,
    },
    include: {
      datasources: datasourceId
        ? {
            where: {
              id: datasourceId,
            },
          }
        : true,
    },
  });

  if (!project) {
    return res.status(403).json({
      error: {
        message: "Invalid API key",
      },
    });
  }

  if (datasourceId && !project.datasources.length) {
    return res.status(400).json({
      error: {
        message: "Invalid datasourceId",
      },
    });
  }

  const match = await bcrypt.compare(key, project.encryptedApiKey!);

  if (!match) {
    res.status(403).json({
      error: {
        message: "Invalid API key",
      },
    });
  }

  /**
   * Generate JWT
   * See Step 1: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app#generating-an-installation-access-token
   */
  const auth = createAppAuth({
    appId: process.env.APP_ID!,
    privateKey: process.env.PRIVATE_KEY!,
  });

  // Retrieve installation access token
  const installationAuthentication = await auth({
    type: "installation",
    installationId: project.installationId,
  });

  const octokit = new Octokit({
    auth: installationAuthentication.token,
  });

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
    return res.status(200).json({
      data: indexPost || content[0],
    });
  }

  const sortedContent = content.sort((a, b) =>
    new Date(a?.metadata.date) < new Date(b?.metadata.date) ? 1 : -1
  );

  res.status(200).json({ data: sortedContent });
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

  const transform = Markdoc.transform(ast, {
    variables: {},
    tags: {
      image: {
        render: "Image",
        children: [],
        attributes: {
          src: {
            type: String,
            required: true,
            errorLevel: "critical",
          },
          alt: {
            type: String,
          },
        },
        selfClosing: true,
      },
      callout: {
        render: "Callout",
        children: ["paragraph", "tag", "list"],
        attributes: {
          type: {
            type: String,
            default: "info",
            matches: ["caution", "check", "info", "warning", "docs", "tada"],
            errorLevel: "critical",
          },
        },
      },
    },
  });

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
