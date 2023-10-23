import { TRPCError } from "@trpc/server";
import prisma from "@floe/db";
import { Context } from "../context";
import { getUserInstallations } from "@floe/utils";

export const validateUserHasProject = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: { projectId: string; [key: string]: unknown };
}) => {
  const { projectId } = input;
  const installations = await getUserInstallations(ctx.octokit, ctx.profile.id);
  const userInstallationIds = installations.map((i) => i.id);

  try {
    await prisma.project.findFirstOrThrow({
      where: {
        installationId: {
          in: userInstallationIds,
        },
        AND: {
          id: projectId,
        },
      },
    });
  } catch {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
};
