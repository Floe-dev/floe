import { Button, Input } from "@floe/ui";
import { z } from "zod";
import { db } from "@floe/db";
import { slugify } from "@floe/lib/slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { Nav } from "./nav";

const schema = z
  .object({
    name: z.string().min(3).max(24),
  })
  .required();

async function createWorkspace(formData: FormData) {
  "use server";

  const { name } = schema.parse({
    name: formData.get("name"),
  });
  const slug = slugify(name);

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error("User not found");
  }

  return db.workspace.create({
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
}

export function Onboarding() {
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center pt-32">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[360px] prose prose-zinc">
          <h2 className="mb-2">Create a workspace</h2>
          <p className="mb-6">Please tell us a bit about your company.</p>
          <form action={createWorkspace} className="flex flex-col items-start">
            <Input
              label="Company name*"
              name="name"
              placeholder="Acme Inc"
              type="text"
            />
            <Button className="w-full mt-3" type="submit">
              Continue
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
