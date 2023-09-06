import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db/client";
import { protectedProcedure, router } from "@/server/trpc";
import { validateUserHasInstallation } from "@/server/validators/user-has-installation";
import { validateUserHasProject } from "../validators/user-has-project";

export const projectRouter = router({
  listByInstallationId: protectedProcedure
    .input(
      z.object({
        installationId: z.number(),
      })
    )
    .query(async (args) => {
      /**
       * VALIDATORS
       */
      validateUserHasInstallation(args);

      const { installationId } = args.input;

      const projects = await prisma.project.findMany({
        where: {
          installationId
        },
        include: {
          datasources: true,
        },
      });

      return projects;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(64),
        slug: z.string().min(7),
        installationId: z.number(),
        description: z.string().optional(),
      })
    ).mutation(async ({ input, ctx }) => {
      // TODO: VALIDATE
      const project = await prisma.project.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          installationId: input.installationId,
        },
      });

      return project;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    ).mutation(async (args) => {
      await validateUserHasProject(args);

      return prisma.project.delete({
        where: {
          id: args.input.projectId,
        },
      });
    }),

  rollKey: protectedProcedure
  .input(
    z.object({
      projectId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    // TODO: VALIDATE

    const rounds = 10;
    // Use the user id as the primrary key
    const apiKeyId = `public_${crypto.randomUUID()}`;
    const token = `secret_${crypto.randomUUID()}`;

    bcrypt.hash(token, rounds, async (err, hash) => {
      if (err) {
        throw err;
      }

      await prisma.project.update({
        data: {
          apiKeyId,
          encryptedApiKey: hash,
        },
        where: {
          id: input.projectId,
        },
      });
    });

    return {
      apiKeyId,
      token,
    };
  }),
});
