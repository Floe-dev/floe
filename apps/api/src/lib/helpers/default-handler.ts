import type {
  NextApiHandler,
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "~/types/private-middleware";

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
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const query = req.query as { version: string };
    const versionNumber = parseInt(query.version, 10);

    if (isNaN(versionNumber)) {
      res.status(400).json({
        message: "Invalid version",
      });
      return;
    }

    const handler = (
      await handlers[req.method as keyof typeof handlers]?.[versionNumber]
    )?.default;

    if (!handler) {
      res.status(405).json({
        message: `Method Not Allowed (Allow: ${Object.keys(handlers).join(
          ","
        )})`,
      });
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
