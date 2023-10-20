import { z } from "zod";
import prisma from "@floe/db";
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
        name: z.string().min(3).max(24),
        slug: z.string().min(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: VALIDATE
      // const files = await getFileTree(ctx.octokit, {
      //   owner: input.owner,
      //   repo: input.repository,
      //   ref: input.baseBranch,
      //   rules: ["**/*.md"],
      // });

      // const posts = files.map((f) => ({ filename: f }));

      const dataSource = await prisma.dataSource.create({
        data: {
          name: input.name,
          slug: input.slug,
          projectId: input.projectId,
          owner: input.owner,
          repo: input.repository,
          baseBranch: input.baseBranch,
          path: "/",
          // posts: {
          //   create: posts,
          // },
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
