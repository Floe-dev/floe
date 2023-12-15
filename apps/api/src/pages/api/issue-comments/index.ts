import { defaultHandler } from "~/lib/helpers/default-handler";
import { withPrivateMiddleware } from "~/lib/helpers/with-private-middlware";

export default withPrivateMiddleware()(
  defaultHandler({
    GET: {
      1: import("./_get"),
    },
    POST: {
      1: import("./_post"),
    },
    PATCH: {
      1: import("./_patch"),
    },
  })
);
