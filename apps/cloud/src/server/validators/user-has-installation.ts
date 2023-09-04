import { Context } from "../context";
import { TRPCError } from "@trpc/server";
import { getUserInstallations } from "@/server/shared/installations";

export const validateUserHasInstallation = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: { installationId: number; [key: string]: unknown };
}) => {
  const { installationId } = input;
  const installations = await getUserInstallations(ctx);
  const userInstallationIds = installations.map((i) => i.id);

  if (!userInstallationIds.includes(installationId)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
};
