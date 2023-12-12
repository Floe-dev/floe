"use server";

import { z } from "zod";
import { db } from "@floe/db";
import { slugify } from "@floe/lib/slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

const schema = z
  .object({
    name: z.string().min(3).max(24),
  })
  .required();

export async function createWorkspace(formData: FormData) {
  const { name } = schema.parse({
    name: formData.get("name"),
  });
  const slug = slugify(name);

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const workspace = await db.workspace.create({
      data: {
        name,
        slug,
        members: {
          createMany: {
            data: [
              {
                userId: session.user.id,
                role: "OWNER",
              },
            ],
          },
        },
      },
    });

    return {
      status: "success",
      message: "Workspace created successfully!",
      slug: workspace.slug,
    };
  } catch (e) {
    return {
      status: "error",
      message:
        e.code === "P2002"
          ? "A workspace with that name already exists."
          : "Workspace could not be created.",
      slug: null,
    };
  }
}
