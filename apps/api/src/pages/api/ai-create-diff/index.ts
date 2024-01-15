import { defaultHandler } from "~/lib/middleware/default-handler";
import { withMiddleware } from "~/lib/middleware/with-middlware";

export default withMiddleware()(
  defaultHandler({
    GET: {
      1: import("./_get"),
    },
  })
);
