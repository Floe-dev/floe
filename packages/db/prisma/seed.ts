import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: "test-workspace" },
    update: {},
    create: {
      name: "Test Workspace",
      slug: "test-workspace",
    },
  });

  console.log("💼 Workspace created: ", workspace);

  const user = await prisma.user.upsert({
    where: { email: "test@floe.dev" },
    update: {},
    create: {
      email: "test@floe.dev",
      name: "Testy McTestface",
    },
  });

  console.log("👤 User created: ", user);

  const workspaceMembership = await prisma.workspaceMembership.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
    },
  });

  console.log("👥 WorkspaceMembership created: ", workspaceMembership);

  const fakeSession = randomBytes(16).toString("hex");

  // Date 1 month from now
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setMonth(currentDate.getMonth() + 1);

  const session = await prisma.session.upsert({
    where: { sessionToken: fakeSession },
    update: {
      expires: futureDate,
    },
    create: {
      sessionToken: fakeSession,
      userId: user.id,
      expires: futureDate,
    },
  });

  console.log("🔐 Session created: ", session);
  console.log(
    "ℹ️ To log in, start the dev server and go to localhost:3001. Then run the following command in your console:\n"
  );
  console.log(`document.cookie="next-auth.session-token=${fakeSession}"`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
