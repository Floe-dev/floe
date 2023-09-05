import { Project } from "@floe/db";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { Middleware } from "next-api-middleware";
import { Octokit } from "octokit";

export type NextApiRequestExtension = NextApiRequest & {
  project?: Project;
  octokit?: Octokit;
};

export type NextApiResponseExtension = NextApiResponse;

export type CustomMiddleware = Middleware<
  NextApiRequestExtension,
  NextApiResponse
>;

export type { NextApiHandler };
