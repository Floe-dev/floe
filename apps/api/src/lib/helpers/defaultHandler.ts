import type {
  NextApiHandler,
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/privateMiddleware";

type Handlers = {
  [method in "GET" | "POST" | "PATCH" | "PUT" | "DELETE"]?: {
    [key in number]: Promise<{
      default: NextApiHandler;
    }>;
  };
};

export const defaultHandler =
  (handlers: Handlers) =>
  async (req: NextApiRequestExtension, res: NextApiResponseExtension) => {
    const query = req.query as { version: string };
    const versionNumber = parseInt(query.version, 10);

    if (isNaN(versionNumber)) {
      return res.status(400).json({
        message: "Invalid version",
      });
    }

    const handler = (
      await handlers[req.method as keyof typeof handlers]?.[versionNumber]
    )?.default;

    if (!handler) {
      return res.status(405).json({
        message: `Method Not Allowed (Allow: ${Object.keys(handlers).join(
          ","
        )})`,
      });
    }

    try {
      await handler(req, res);
      return;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };
