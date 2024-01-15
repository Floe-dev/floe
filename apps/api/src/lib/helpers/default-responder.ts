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
    const result = (await f(req, res)) as unknown;
    if (result) res.json(result);
  };
}
