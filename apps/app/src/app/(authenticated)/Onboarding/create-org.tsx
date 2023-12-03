import { z } from "zod";
import { Input } from "@floe/ui";
import { slugify } from "@floe/utils";
import { getServerSession } from "next-auth";
import { db } from "@floe/db";
import { authOptions } from "~/server/auth";

const schema = z
  .object({
    name: z.string().min(3).max(24),
  })
  .required();

export function CreateOrg() {
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

  return (
    // <Card
    //   bottomActions={[
    //     {
    //       text: isLoading ? "..." : "Next step",
    //       type: "submit",
    //       disabled: !isValid || isLoading,
    //       onClick: async () => {
    //         await mutateAsync({
    //           name: getValues("name"),
    //           slug,
    //         });
    //       },
    //     },
    //   ]}
    //   title="Workspace"
    // >
    <form action={createWorkspace} className="flex flex-col items-start gap-6">
      <div className="flex w-full gap-4">
        <Input label="Name*" name="name" placeholder="Acme Inc" type="text" />
      </div>
    </form>
    // </Card>
  );
}
