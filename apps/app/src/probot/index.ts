import prisma from "@floe/db";
import { Probot } from "probot";
import { handlePushEvents } from "./push-handler";

const appHandler = (app: Probot) => {
  /**
   * Get all new changelog files from push event
   */
  // @ts-ignore
  app.on("push", async (context) => {
    // handlePushEvents(context);
    const project = await prisma.project.findFirst({
      where: {
        slug: "floe",
      },
    });

    console.log(111111, project);
  });
};

export default appHandler;
