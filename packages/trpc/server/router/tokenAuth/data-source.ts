import { z } from "zod";
import prisma from "@floe/db";
import { protectedTokenProcedure, router } from "../../trpc";

export const dataSourceRouter = router({
  create: protectedTokenProcedure
    .input(
      z.object({
        projectSlug: z.string(),
        owner: z.string(),
        repository: z.string(),
        baseBranch: z.string(),
        name: z.string().min(3).max(24),
        slug: z.string().min(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: VALIDATE

      console.log(999999999, input);

      const project = await prisma.project.findUnique({
        where: {
          slug: input.projectSlug,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      const dataSource = await prisma.dataSource.create({
        data: {
          name: input.name,
          slug: input.slug,
          projectId: project?.id,
          owner: input.owner,
          repo: input.repository,
          baseBranch: input.baseBranch,
          path: "/",
        },
      });

      return dataSource;
    }),
});
