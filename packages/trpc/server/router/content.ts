import { protectedTokenProcedure, router } from "../trpc";

export const contentRouter = router({
  generate: protectedTokenProcedure.query(async ({ ctx }) => {
    console.log("CTX: ", ctx.req.headers);
    return "Hello, world!";
  }),
});
