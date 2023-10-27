import { protectedProcedure, router } from "../trpc";
import { getUserInstallations } from "@floe/utils";

export const installationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) =>
    getUserInstallations(ctx.octokit, ctx.session?.profile.id)
  ),
});
