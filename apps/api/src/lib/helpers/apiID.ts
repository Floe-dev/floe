import { CustomMiddleware } from "@/lib/types/privateMiddleware";

export const apiID: CustomMiddleware = async (req, res, next) => {
  const keyId = req.headers["x-api-id"] as string | undefined;

  if (!keyId) {
    return res.status(401).json({
      error: {
        message: "No api key id provided",
      },
    });
  }

  await next();
};
