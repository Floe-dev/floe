"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { db } from "@floe/db";

const schema = z.object({
  name: z.string().min(3).max(24),
  workspaceId: z.string(),
});

export const rollKey = async (name: string, workspaceId: string) => {
  const parsed = schema.parse({
    name,
    workspaceId,
  });

  const rounds = 10;
  // Use the user id as the primrary key
  const token = `secret_${crypto.randomUUID()}`;
  // Slug is the last 4 characters of the token
  const slug = token.slice(-4);

  await new Promise((resolve) => {
    bcrypt.hash(token, rounds, async (err, hash) => {
      if (err) {
        throw err;
      }

      await db.workspace.update({
        where: {
          id: parsed.workspaceId,
        },
        data: {
          encrytpedKeys: {
            createMany: {
              data: [
                {
                  name,
                  key: hash,
                  slug,
                },
              ],
            },
          },
        },
      });

      resolve(null);
    });
  });

  revalidatePath(`/floe`);
  return token;
};
