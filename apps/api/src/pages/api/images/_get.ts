import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/publicMiddleware";
import prisma from "@floe/db";
import Jimp from "jimp";
import { defaultResponder } from "@/lib/helpers/defaultResponder";
import { createAppAuth, Octokit } from "@floe/utils";

async function handler(
  { query }: NextApiRequestExtension,
  res: NextApiResponseExtension
) {
  const { slug, datasourceId, filename } = query as {
    slug: string;
    datasourceId: string;
    filename: string;
  };

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
    include: {
      datasources: {
        where: {
          id: datasourceId,
        },
      },
    },
  });

  if (!slug || !project) {
    return res.status(401).json({
      error: {
        message: "Invalid project slug",
      },
    });
  }

  const datasource = project.datasources[0];

  if (!datasource) {
    return res.status(404).json({
      error: {
        message: "Data source not found",
      },
    });
  }

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
      path: `.floe/public${filename}`,
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

export default defaultResponder(handler);
