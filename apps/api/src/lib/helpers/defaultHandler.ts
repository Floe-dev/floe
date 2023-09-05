import type {
  NextApiHandler,
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/middleware";

type Handlers = {
  [method in "GET" | "POST" | "PATCH" | "PUT" | "DELETE"]?: Promise<{
    default: NextApiHandler;
  }>;
};

export const defaultHandler =
  (handlers: Handlers) =>
  async (req: NextApiRequestExtension, res: NextApiResponseExtension) => {
    const handler = (await handlers[req.method as keyof typeof handlers])
      ?.default;

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
