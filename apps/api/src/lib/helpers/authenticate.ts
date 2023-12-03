import bcrypt from "bcrypt";
import { db } from "@floe/db";
import type { CustomMiddleware } from "~/types/private-middleware";

export const authenticate: CustomMiddleware = async (req, res, next) => {
  const slug = req.headers["x-api-workspace"] as string | undefined;
  const key = req.headers["x-api-key"] as string | undefined;

  if (!key) {
    res.status(401).json({
      error: {
        message: "No api key provided",
      },
    });
    return;
  }

  if (!slug) {
    res.status(401).json({
      error: {
        message: "No workspace slug provided",
      },
    });
    return;
  }

  const workspace = await db.workspace.findUnique({
    where: {
      slug,
    },
    include: {
      encrytpedKeys: {
        where: {
          slug: key.slice(-4),
        },
      },
      githubIntegration: true,
      gitlabIntegration: true,
    },
  });

  if (!workspace || !workspace.encrytpedKeys[0]) {
    res.status(401).json({
      error: {
        message: "Invalid API key",
      },
    });
    return;
  }

  const match = await bcrypt.compare(key, workspace.encrytpedKeys[0].key);

  if (!match) {
    res.status(401).json({
      error: {
        message: "Invalid API key",
      },
    });
    return;
  }

  req.workspace = workspace;
  req.workspaceSlug = slug;

  await next();
};
