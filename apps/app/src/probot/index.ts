import { Probot } from "probot";
import { handlePushEvents } from "./push-handler";

const appHandler = (app: Probot) => {
  /**
   * Get all new changelog files from push event
   */
  // @ts-ignore
  app.on("push", async (context) => {
    handlePushEvents(context);
  });

  app.on("check_run", async (context) => {
    console.log("check_run", context);
  });

  app.on("check_run.created", async (context) => {
    console.log("check_run.created", context);
  });
};

export default appHandler;
