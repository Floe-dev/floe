import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

const isSession = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

const isValidToken = t.middleware(async ({ next, ctx }) => {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${ctx.token}`,
      },
    });

    if (response.status !== 200) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next();
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isSession);
export const protectedTokenProcedure = t.procedure.use(isValidToken);
