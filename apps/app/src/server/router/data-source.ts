import { z } from "zod";
import { prisma } from "@/server/db/client";
import { protectedProcedure, router } from "@/server/trpc";
import { getFileTree } from "@floe/utils";

export const dataSourceRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        owner: z.string(),
        repository: z.string(),
        baseBranch: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const files = await getFileTree(ctx.octokit, {
        owner: input.owner,
        repo: input.repository,
        ref: input.baseBranch,
        rules: [".floe/**/*.md"],
      });

      const posts = files.map((f) => ({ filename: f }));

      const dataSource = await prisma.dataSource.create({
        data: {
          projectId: input.projectId,
          owner: input.owner,
          repo: input.repository,
          baseBranch: input.baseBranch,
          path: "/",
          posts: {
            create: posts,
          },
        },
      });

      return dataSource;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        dataSourceId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: VALIDATE

      return prisma.dataSource.delete({
        where: {
          id: input.dataSourceId,
        },
      });
    }),
});
