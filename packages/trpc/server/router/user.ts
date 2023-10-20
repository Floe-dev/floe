import prisma from "@floe/db";
import { protectedTokenProcedure, router } from "../trpc";

export const userRouter = router({
  test: protectedTokenProcedure.query(async ({ ctx }) => {
    console.log("CTX: ", ctx.req.headers);
    return "Hello, world!";
  }),
});
