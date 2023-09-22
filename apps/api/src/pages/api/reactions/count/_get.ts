import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/publicMiddleware";
import { createHash } from "crypto";
import prisma from "@floe/db";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

async function handler(
  { query, headers, socket }: NextApiRequestExtension,
  res: NextApiResponseExtension
) {
  const { datasourceId, filename } = query as {
    datasourceId: string;
    filename: string;
  };
  const ip = (headers["x-real-ip"] || socket.remoteAddress) as string;

  if (!datasourceId || !filename) {
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
      postFilename: filename,
    },
  });

  const userReactions = await prisma.reaction.findMany({
    where: {
      ipAddress: hashedIp,
      postDataSourceId: datasourceId,
      postFilename: filename,
    },
  });

  return {
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
  };
}

export default defaultResponder(handler);
