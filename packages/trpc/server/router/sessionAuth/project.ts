import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@floe/db";
import { protectedProcedure, router } from "../../trpc";
import { validateUserHasInstallation } from "../../validators/user-has-installation";
import { validateUserHasProject } from "../../validators/user-has-project";

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
        logo: z.string().url().optional().or(z.literal("")),
        favicon: z.string().url().optional().or(z.literal("")),
        description: z.string().optional().or(z.literal("")),
        homepageUrl: z.string().url().optional().or(z.literal("")),
      })
    )
    .mutation(async (args) => {
      /**
       * VALIDATORS
       */
      await validateUserHasInstallation(args);
      // TODO: Validate once restrictions decided on. For now unlimited project creation is allowed.
      const { input, ctx } = args;

      const STARTER_OWNER = "Floe-dev";
      const STARTER_REPO = "floe-sample-data";
      const STARTER_BRANCH = "main";

      // const files = await getFileTree(ctx.octokit, {
      //   owner: STARTER_OWNER,
      //   repo: STARTER_REPO,
      //   ref: STARTER_BRANCH,
      //   rules: [".floe/**/*.md"],
      // });

      // const posts = files.map((f) => ({ filename: f }));

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
                name: STARTER_REPO,
                slug: STARTER_REPO,
                owner: STARTER_OWNER,
                repo: STARTER_REPO,
                baseBranch: STARTER_BRANCH,
                path: "/",
                // posts: {
                //   create: posts,
                // },
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
        logo: z.string().url().optional().or(z.literal("")),
        favicon: z.string().url().optional().or(z.literal("")),
        description: z.string().optional().or(z.literal("")),
        twitterUrl: z.string().url().optional().or(z.literal("")),
        instagramUrl: z.string().url().optional().or(z.literal("")),
        facebookUrl: z.string().url().optional().or(z.literal("")),
        githubUrl: z.string().url().optional().or(z.literal("")),
        slackUrl: z.string().url().optional().or(z.literal("")),
        discordUrl: z.string().url().optional().or(z.literal("")),
        youtubeUrl: z.string().url().optional().or(z.literal("")),
        twitchUrl: z.string().url().optional().or(z.literal("")),
        linkedinUrl: z.string().url().optional().or(z.literal("")),
        homepageUrl: z.string().url().optional().or(z.literal("")),
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
          twitterURL: input.twitterUrl,
          instagramURL: input.instagramUrl,
          facebookURL: input.facebookUrl,
          githubURL: input.githubUrl,
          slackURL: input.slackUrl,
          discordURL: input.discordUrl,
          youtubeURL: input.youtubeUrl,
          twitchURL: input.twitchUrl,
          linkedinURL: input.linkedinUrl,
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
