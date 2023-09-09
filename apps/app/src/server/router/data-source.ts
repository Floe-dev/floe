import { z } from "zod";
import { prisma } from "@/server/db/client";
import { protectedProcedure, router } from "@/server/trpc";
import { getFileTree, createRepoFromTemplate } from "@floe/utils";

const FLOE_TEMPLATE_OWNER = "Floe-dev";
const FLOE_TEMPLATE_REPO = "floe-sample-data";

export const dataSourceRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        owner: z.string(),
        repository: z.string(),
        baseBranch: z.string(),
        createOrUpdateRepo: z
          .union([z.literal("CREATE"), z.literal("UPDATE")])
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.createOrUpdateRepo === "CREATE") {
        createRepoFromTemplate(ctx.octokit, {
          templateOwner: FLOE_TEMPLATE_OWNER,
          templateRepo: FLOE_TEMPLATE_REPO,
          owner: input.owner,
          name: input.repository,
          description: "Floe data source",
          includeAllBranches: false,
          privateRepo: true,
        });
      }

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
