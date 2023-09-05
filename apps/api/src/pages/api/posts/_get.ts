import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/middleware";
import { defaultResponder } from "@/lib/helpers/defaultResponder";
import { getFileTree } from "@floe/utils";
import { prisma } from "@/lib/db/client";

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

export default defaultResponder(handler);
function generatePostContent(
  octokit: {
    id: string;
    repo: string;
    owner: string;
    baseBranch: string;
    path: string;
    projectId: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  },
  datasource: {
    id: string;
    filename: string;
    datasourceId: string;
    createdAt: Date;
    updatedAt: Date;
  },
  post: string,
  imageBasePath: unknown
): any {
  throw new Error("Function not implemented.");
}
