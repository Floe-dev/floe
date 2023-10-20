import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "../server/context";
import { appRouter } from "../server";

export const NextApiHandler = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
