import { router } from "./trpc";

export const appRouter = router({});

export type AppRouter = typeof appRouter;
export * from "@trpc/server";
