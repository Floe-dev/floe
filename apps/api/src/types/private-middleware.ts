import type { Prisma } from "@floe/db";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { Middleware } from "next-api-middleware";
import type QueryString from "qs";

export type Workspace = Prisma.WorkspaceGetPayload<{
  include: {
    encrytpedKeys: true;
    githubIntegration: true;
    gitlabIntegration: true;
    subscription: true;
  };
}>;

export type NextApiRequestExtension = NextApiRequest & {
  workspace: Workspace;
  workspaceSlug: string;
  queryObj: QueryString.ParsedQs;
};

export type NextApiResponseExtension = NextApiResponse;

export type CustomMiddleware = Middleware<NextApiRequestExtension>;

export type { NextApiHandler };
