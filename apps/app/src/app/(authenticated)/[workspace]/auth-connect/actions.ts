"use server";

import { db } from "@floe/db";
import { encryptData } from "@floe/utils";

export const setGitlabToken = (workspaceId: string, formData: FormData) => {
  const token = formData.get("token") as string;
  const encryptedToken = encryptData(token);

  return db.gitlabIntegration.upsert({
    where: {
      workspaceId,
    },
    create: {
      workspaceId,
      encryptedAccessToken: encryptedToken,
    },
    update: {
      encryptedAccessToken: encryptedToken,
    },
  });
};
