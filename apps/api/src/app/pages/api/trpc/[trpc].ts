import { trpcNext, appRouter, createContext } from "@floe/trpc";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
