import type {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/middleware";

type Handle<T> = (
  req: NextApiRequestExtension,
  res: NextApiResponseExtension
) => Promise<T>;

export function defaultResponder<T>(f: Handle<T>) {
  return async (
    req: NextApiRequestExtension,
    res: NextApiResponseExtension
  ) => {
    let ok = false;
    try {
      const result = await f(req, res);
      ok = true;
      if (result) res.json(result);
    } catch (err) {
      console.error(err);
      res.statusCode = err.statusCode;
      res.json({ message: err.message });
    }
  };
}
