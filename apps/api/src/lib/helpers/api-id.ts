import type { CustomMiddleware } from "~/types/private-middleware";

export const apiID: CustomMiddleware = async (req, res, next) => {
  const slug = req.headers["x-api-workspace"] as string | undefined;

  if (!slug) {
    res.status(401).json({
      message: "No workspace slug provided",
    });
    return;
  }

  await next();
};
