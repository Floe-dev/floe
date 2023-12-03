import type { CustomMiddleware } from "~/types/private-middleware";

export const apiID: CustomMiddleware = async (req, res, next) => {
  const slug = req.headers["x-api-workspace"] as string | undefined;

  if (!slug) {
    return res.status(401).json({
      error: {
        message: "No workspace slug provided",
      },
    });
  }

  await next();
};
