import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const { req, res } = opts;

  return {
    req,
    res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
