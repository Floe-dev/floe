import { createHash } from "crypto";
import { prisma } from "@/server/db/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  if (req.method !== "PUT") {
    return res.status(405).json({
      error: {
        message: "Method not allowed",
      },
    });
  }

  const ip = (req.headers["x-real-ip"] || req.socket.remoteAddress) as string;
  const body = req.body as {
    type: any;
    value: boolean;
    datasourceId: string;
    fileName: string;
  };
  /**
   * TODO: Can use Zod here instead
   */
  if (
    body.datasourceId === undefined ||
    body.fileName === undefined ||
    body.value === undefined ||
    body.type === undefined
  ) {
    return res.status(400).json({
      error: {
        message: "Missing required fields",
      },
    });
  }

  const hashedIp = createHash("sha256").update(ip).digest("hex");

  /**
   * Note: Referential integrity is NOT enforced here.
   * https://www.prisma.io/docs/concepts/components/prisma-schema/relations/relation-mode#which-foreign-key-constraints-are-emulated
   * 
   * So, we should manually check if the changelog exists.
   */
  const changelog = await prisma.post.findUnique({
    where: {
      unique_post: {
        datasourceId: body.datasourceId,
        filename: body.fileName,
      },
    }
  });

  if (!changelog) {
    return res.status(400).json({
      error: {
        message: "Changelog not found",
      },
    });
  }

  const userReaction = await prisma.reaction.upsert({
    where: {
      unique_reaction: {
        type: body.type,
        ipAddress: hashedIp,
        postDataSourceId: body.datasourceId,
        postFilename: body.fileName,
      },
    },
    create: {
      ipAddress: hashedIp,
      postDataSourceId: body.datasourceId,
      postFilename: body.fileName,
      value: body.value,
      type: body.type,
    },
    update: {
      value: body.value,
    },
  });

  return res.status(200).json({
    data: {
      userReaction: {
        type: userReaction.type,
        value: userReaction.value,
      },
    },
  });
}
