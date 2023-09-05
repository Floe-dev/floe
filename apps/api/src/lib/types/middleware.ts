import { Prisma } from "@floe/db";
import { Octokit } from "@floe/utils";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { Middleware } from "next-api-middleware";

type ProjectsWithDatasources = Prisma.ProjectGetPayload<{
  include: { datasources: true };
}>;

export type NextApiRequestExtension = NextApiRequest & {
  project: ProjectsWithDatasources;
  octokit: Octokit;
  keyId: string;
};

export type NextApiResponseExtension = NextApiResponse;

export type CustomMiddleware = Middleware<
  NextApiRequestExtension,
  NextApiResponse
>;

export type { NextApiHandler };
