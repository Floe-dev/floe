import { defaultHandler } from "~/lib/helpers/default-handler";
import { withMiddleware } from "~/lib/helpers/with-middlware";

export default withMiddleware()(
  defaultHandler({
    GET: {
      1: import("./_get"),
    },
  })
);
