import { CustomMiddleware } from "@/lib/types/privateMiddleware";

export const apiID: CustomMiddleware = async (req, res, next) => {
  const slug = req.headers["x-api-slug"] as string | undefined;

  if (!slug) {
    return res.status(401).json({
      error: {
        message: "No project slug provided",
      },
    });
  }

  await next();
};
