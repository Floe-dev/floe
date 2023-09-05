import bcrypt from "bcrypt";
import { prisma } from "@/lib/db/client";
import { CustomMiddleware } from "@/lib/types/middleware";

export const authenticate: CustomMiddleware = async (req, res, next) => {
  const query = req.query as { path: string; datasourceId?: string };
  const { datasourceId } = query;

  const keyId = req.headers["x-api-id"] as string | undefined;
  const key = req.headers["x-api-key"] as string | undefined;

  if (!key) {
    return res.status(401).json({
      error: {
        message: "No api key provided",
      },
    });
  }

  if (!keyId) {
    return res.status(401).json({
      error: {
        message: "No api key id provided",
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
    return res.status(401).json({
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
    res.status(401).json({
      error: {
        message: "Invalid API key",
      },
    });
  }

  req.project = project;

  await next();
};
