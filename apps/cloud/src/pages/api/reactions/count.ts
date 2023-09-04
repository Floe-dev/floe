import { prisma } from "@/server/db/client";
import { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";

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

  const query = req.query as { datasourceId: string; fileName: string };
  const { datasourceId, fileName } = query;
  const ip = (req.headers["x-real-ip"] || req.socket.remoteAddress) as string;

  if (!datasourceId || !fileName) {
    return res.status(400).json({
      error: {
        message: "Missing required query parameters",
      },
    });
  }

  const hashedIp = createHash("sha256").update(ip).digest("hex");

  const reactions = await prisma.reaction.groupBy({
    by: ["type"],
    _count: {
      value: true,
    },
    where: {
      value: true,
      postDataSourceId: datasourceId,
      postFilename: fileName,
    },
  });

  const userReactions = await prisma.reaction.findMany({
    where: {
      ipAddress: hashedIp,
      postDataSourceId: datasourceId,
      postFilename: fileName,
    },
  });

  return res.status(200).json({
    data: {
      reactions: reactions.map((r) => ({
        type: r.type,
        count: r._count.value,
      })),
      userReactions: userReactions.map((r) => ({
        type: r.type,
        value: r.value,
      })),
    },
  });
}
