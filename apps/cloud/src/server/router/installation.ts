import { protectedProcedure, router } from "@/server/trpc";
import { getUserInstallations } from "@/server/shared/installations";

export const installationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => getUserInstallations(ctx)),
});
