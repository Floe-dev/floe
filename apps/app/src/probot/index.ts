import { Probot } from "probot";
import { handlePushEvents } from "./push-handler";
import { handleCheckEvents } from "./check_suite-handler";

const appHandler = (app: Probot) => {
  /**
   * Get all new changelog files from push event
   */
  // @ts-ignore
  app.on("push", async (context) => {
    handlePushEvents(context);
  });

  app.on("check_suite", async (context) => {
    console.log("check_suite", context);
    if (
      context.payload.action === "requested" ||
      context.payload.action === "rerequested"
    ) {
      handleCheckEvents(context);
    }
  });

  // app.on("check_suite.completed", async (context) => {
  //   console.log("check_suite.completed", context);
  // });

  // app.on("check_suite.requested", async (context) => {
  //   console.log("check_suite.requested", context);
  // });

  // app.on("check_run", async (context) => {
  //   console.log("check_run", context);
  // });

  // app.on("check_run.created", async (context) => {
  //   console.log("check_run.created", context);
  // });
};

export default appHandler;
