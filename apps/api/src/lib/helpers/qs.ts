import { parse } from "qs";
import type { CustomMiddleware } from "~/types/private-middleware";

/**
 * This is used to parse the query string from the url instead of the built in req.query
 * req.query does not gracefully parce arrays or objects
 */
export const qs: CustomMiddleware = async (req, res, next) => {
  const url = req.url;

  if (!url) {
    return;
  }

  const queryString = url.split("?")[1];

  // Parse the query object from the url
  const parsed = parse(queryString);

  req.queryObj = parsed;

  await next();
};
