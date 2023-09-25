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
};

export default appHandler;
