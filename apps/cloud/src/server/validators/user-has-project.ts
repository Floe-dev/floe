import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db/client";
import { Context } from "../context";
import { getUserInstallations } from "../shared/installations";

export const validateUserHasProject = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: { projectId: string; [key: string]: unknown };
}) => {
  const { projectId } = input;
  const installations = await getUserInstallations(ctx);
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
