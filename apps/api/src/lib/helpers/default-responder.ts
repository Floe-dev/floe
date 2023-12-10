import type {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "~/types/private-middleware";

type Handle<T> = (
  req: NextApiRequestExtension,
  res: NextApiResponseExtension
) => Promise<T>;

export function defaultResponder<T>(f: Handle<T>) {
  return async (
    req: NextApiRequestExtension,
    res: NextApiResponseExtension
  ) => {
    try {
      const result = (await f(req, res)) as unknown;
      if (result) res.json(result);
    } catch (err) {
      console.error(err);
      res.statusCode = err.statusCode;
      res.json({ message: err.message });
    }
  };
}
