import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { Middleware } from "next-api-middleware";
import type QueryString from "qs";

export type NextApiRequestExtension = NextApiRequest & {
  workspaceSlug: string;
  queryObj: QueryString.ParsedQs;
};

export type NextApiResponseExtension = NextApiResponse;

export type CustomMiddleware = Middleware<NextApiRequestExtension>;

export type { NextApiHandler };
