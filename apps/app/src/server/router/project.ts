import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db/client";
import { protectedProcedure, router } from "@/server/trpc";
import { validateUserHasInstallation } from "@/server/validators/user-has-installation";
import { validateUserHasProject } from "../validators/user-has-project";
import { getFileTree } from "@floe/utils";

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
      await validateUserHasInstallation(args);

      const { installationId } = args.input;

      const projects = await prisma.project.findMany({
        where: {
          installationId,
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
        name: z.string().min(3).max(24),
        slug: z.string().min(3),
        installationId: z.number(),
        logo: z.string().url().optional(),
        favicon: z.string().url().optional(),
        description: z.string().optional(),
        homepageUrl: z.string().url().optional(),
      })
    )
    .mutation(async (args) => {
      // TODO: Validate once restrictions decided on. For now unlimited project creation is allowed.
      const { input, ctx } = args;

      const STARTER_OWNER = "Floe-dev";
      const STARTER_REPO = "floe-sample-data";
      const STARTER_BRANCH = "main";

      const files = await getFileTree(ctx.octokit, {
        owner: STARTER_OWNER,
        repo: STARTER_REPO,
        ref: STARTER_BRANCH,
        rules: [".floe/**/*.md"],
      });

      const posts = files.map((f) => ({ filename: f }));

      const project = await prisma.project.create({
        data: {
          name: input.name,
          slug: input.slug,
          logo: input.logo,
          favicon: input.favicon,
          description: input.description,
          homepageURL: input.homepageUrl,
          installationId: input.installationId,
          datasources: {
            create: [
              {
                owner: STARTER_OWNER,
                repo: STARTER_REPO,
                baseBranch: STARTER_BRANCH,
                path: "/",
                posts: {
                  create: posts,
                },
              },
            ],
          },
        },
      });

      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(3).max(24).optional(),
        slug: z.string().min(3).optional(),
        logo: z.string().url().optional(),
        favicon: z.string().url().optional(),
        description: z.string().optional(),
        homepageUrl: z.string().url().optional(),
        appearance: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
        primary: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
        primaryDark: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
        background: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
        backgroundDark: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
      })
    )
    .mutation(async (args) => {
      /**
       * VALIDATORS
       */
      await validateUserHasProject(args);
      const { input } = args;

      const project = await prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          name: input.name,
          slug: input.slug,
          logo: input.logo,
          favicon: input.favicon,
          description: input.description,
          homepageURL: input.homepageUrl,
          appearance: input.appearance,
          primary: input.primary,
          primaryDark: input.primaryDark,
          background: input.background,
          backgroundDark: input.backgroundDark,
        },
      });

      return project;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(async (args) => {
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
    .mutation(async (args) => {
      /**
       * VALIDATORS
       */
      await validateUserHasProject(args);
      const { input } = args;

      const rounds = 10;
      // Use the user id as the primrary key
      const token = `secret_${crypto.randomUUID()}`;

      bcrypt.hash(token, rounds, async (err, hash) => {
        if (err) {
          throw err;
        }

        await prisma.project.update({
          data: {
            encryptedApiKey: hash,
          },
          where: {
            id: input.projectId,
          },
        });
      });

      return {
        token,
      };
    }),
});
