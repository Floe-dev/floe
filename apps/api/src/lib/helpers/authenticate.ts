import bcrypt from "bcrypt";
import prisma from "@floe/db";
import { CustomMiddleware } from "@/lib/types/privateMiddleware";

export const authenticate: CustomMiddleware = async (req, res, next) => {
  const query = req.query as { datasourceId?: string };
  const { datasourceId } = query;

  const slug = req.headers["x-api-slug"] as string | undefined;
  const key = req.headers["x-api-key"] as string | undefined;

  let admin = false;

  /**
   * Authenticate as an admin for access to all projects
   */
  if (key === process.env.ADMIN_API_KEY) {
    admin = true;
  }

  if (!key) {
    return res.status(401).json({
      error: {
        message: "No api key provided",
      },
    });
  }

  if (!slug) {
    return res.status(401).json({
      error: {
        message: "No project slug provided",
      },
    });
  }

  const project = await prisma.project.findUnique({
    where: {
      slug,
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

  if (!admin) {
    const match = await bcrypt.compare(key, project.encryptedApiKey!);

    if (!match) {
      return res.status(401).json({
        error: {
          message: "Invalid API key",
        },
      });
    }
  }

  req.project = project;
  req.projectSlug = slug;

  await next();
};
