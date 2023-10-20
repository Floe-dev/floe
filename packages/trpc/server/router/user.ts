import prisma from "@floe/db";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  test: publicProcedure.query(async ({ ctx }) => {
    return "Hello, world!";
  }),
});
