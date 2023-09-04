import { prisma } from "@floe/db";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    // const posts = await prisma.post.findMany();
    // console.log(333333, posts);
    const posts = [{ id: 1, title: "test" }];

    return posts;
  }),
});

export * from "./context";
export * from "@trpc/server";
export type AppRouter = typeof appRouter;
export * as trpcNext from "@trpc/server/adapters/next";
