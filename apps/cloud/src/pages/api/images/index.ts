import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import Jimp from "jimp";

/**
 * Note: This is a PUBLIC endpoint
 * It will expose images in the .floe/public/ directory
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data source id and filename from query params
  const { id, did, fn } = req.query as {
    id: string;
    did: string;
    fn: string;
  };

  const project = await prisma.project.findUnique({
    where: {
      apiKeyId: id,
    },
    include: {
      datasources: true,
    },
  });

  if (!id || !project) {
    return res.status(403).json({
      error: {
        message: "Invalid API key",
      },
    });
  }

  const datasource = await prisma.dataSource.findUnique({
    where: {
      id: did,
    },
  });

  if (!datasource) {
    return res.status(404).json({
      error: {
        message: "Data source not found",
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

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: datasource.owner,
      repo: datasource.repo,
      path: `.floe/public${fn}`,
      ref: datasource.baseBranch,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // @ts-ignore
  const content = response.data.download_url;
  const image = await Jimp.read(content);
  /**
   * Note: Ideally this shouldn't be needed. The image should return in full
   * quality, then leave to next/image to optimize delivery. Next/image isn't working though :(
   * https://github.com/vercel/next.js/issues/48077
   */
  // const resizedImage = image.resize(650, Jimp.AUTO).quality(90);
  const imageType = image.getMIME();
  const buffer = await image.getBufferAsync(imageType);

  res.setHeader("Content-Type", imageType);
  res.status(200).send(buffer);
}
