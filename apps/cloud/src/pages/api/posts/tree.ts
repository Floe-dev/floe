import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { Octokit } from "octokit";
import { prisma } from "@/server/db/client";
import { createAppAuth } from "@octokit/auth-app";
import { getFileTree } from "@/server/shared/get-file-tree";
import merge from "deepmerge";
import { DataSource } from "@prisma/client";

type TreeFiles = {
  file: string;
  datasourceId: string;
}

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
      datasources: true,
    },
  });

  if (!project) {
    return res.status(403).json({
      error: {
        message: "Invalid API key",
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

  let requestDataSources = project.datasources;

  if (datasourceId) {
    requestDataSources = project.datasources.filter(
      (datasource) => datasource.id === datasourceId
    );

    if (!requestDataSources.length) {
      return res.status(400).json({
        error: {
          message: "Invalid datasourceId",
        },
      });
    }
  }

  const contents = Promise.all(
    requestDataSources.map(async (datasource) => {
      try {
        const files = await getFileTree(octokit, {
          owner: datasource.owner,
          repo: datasource.repo,
          ref: datasource.baseBranch,
          rules: [`.floe/${path}/**/*.md`],
        });

        return files.map((file) =>
          ({
            file: file.split("/").slice(1).join("/"),
            datasourceId: datasource.id,
          })
        );
      } catch (e: any) {
        return res.status(400).json({
          error: e.message,
        });
      }
    })
  );

  const files = (await contents).flat() as TreeFiles[];
  
  // Need to merge from multiplate datasources
  const mergedFiles = files.reduce((acc, file) => {
    const existingFile = acc.find((f) => f.file === file.file);

    if (existingFile) {
      // TODO: Replace it by datasourceId once default functionality is built out
      return acc;
    }

    return [...acc, file];
  }, [] as TreeFiles[]);

  const fileTree = buildFileTree(files);

  res.status(200).json({ data: fileTree });
}

// @ts-ignore
function buildFileTree(
  treeFiles: TreeFiles[],
) {
  return treeFiles.reduce((tree, treeFile) => {
    const fileSegments = treeFile.file.split("/");

    // recursively walk tree
    // @ts-ignore
    function deepWrite(treeSegment = {}, fileSegments) {
      if (fileSegments.length === 0) {
        return treeSegment;
      }

      const firstSegment = fileSegments.shift();

      const isNode = firstSegment.endsWith(".md");

      if (isNode) {
        return {
          ...treeSegment,
          [firstSegment]: {
            filename: treeFile.file,
            datasourceId: treeFile.datasourceId,
          },
        };
      }

      return {
        ...treeSegment,
        // @ts-ignore
        [firstSegment]: deepWrite(treeSegment[firstSegment], fileSegments),
      };
    }

    return deepWrite(tree, fileSegments);
  }, {});
}
