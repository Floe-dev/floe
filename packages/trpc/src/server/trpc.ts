import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
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

// const isTokenValud = t.middleware(({ next, ctx }) => {
//   fetch("https://api.github.com/user", {
//     headers: {
//       Authorization: `token ${ctx.githubAuthToken}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((json) => {
//       if (json.message === "Bad credentials") {
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//         });
//       }
//     });

//   return next();
// });

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
