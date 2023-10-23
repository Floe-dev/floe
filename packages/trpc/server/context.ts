import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { authOptions, getServerSession } from "@floe/nextauth";
import { getToken } from "next-auth/jwt";
import { Octokit } from "@floe/utils";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const { req, res } = opts;
  // Fixed with: https://github.com/vercel/next.js/issues/46356#issuecomment-1491822686
  const session = await getServerSession(req, res, authOptions);
  const userAuthToken = req.headers.authorization;

  const token = (await getToken({ req }))?.accessToken ?? userAuthToken;

  const octokit = new Octokit({
    auth: token,
  });

  return {
    req,
    res,
    session,
    profile: session?.profile,
    octokit,
    token,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
