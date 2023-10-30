import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

const isSession = t.middleware(async ({ next, ctx }) => {
  /**
   * If using userToken auth
   */
  if (ctx.token) {
    try {
      const response = await ctx.octokit.request("GET /user");
      const profile = response.data;

      if (response.status !== 200 || !profile) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return next({
        ctx: {
          profile,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
  }

  /**
   * Otherwise, check to see if using session auth
   */
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isSession);
