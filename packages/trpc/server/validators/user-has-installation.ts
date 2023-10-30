import { Context } from "../context";
import { TRPCError } from "@trpc/server";
import { getUserInstallations } from "@floe/utils";

export const validateUserHasInstallation = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: { installationId: number; [key: string]: unknown };
}) => {
  const { installationId } = input;
  const installations = await getUserInstallations(ctx.octokit, ctx.profile.id);
  const userInstallationIds = installations.map((i) => i.id);

  if (!userInstallationIds.includes(installationId)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
};
