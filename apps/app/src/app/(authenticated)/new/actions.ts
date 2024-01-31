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
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: "error",
      message:
        validatedFields.error.flatten().fieldErrors.name?.join(", ") ??
        "Invalid form data",
      slug: null,
    };
  }

  const slug = slugify(validatedFields.data.name);

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  /**
   * This shouldn't happen
   */
  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const workspace = await db.workspace.create({
      data: {
        name: validatedFields.data.name,
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

export async function getWorkspace(workspaceSlug: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return db.workspace.findUnique({
    where: {
      slug: workspaceSlug,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      githubIntegration: true,
      gitlabIntegration: true,
    },
  });
}
