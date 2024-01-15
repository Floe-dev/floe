import { defaultHandler } from "~/lib/helpers/default-handler";
import { withMiddleware } from "~/lib/helpers/with-middlware";

export default withMiddleware("authenticate")(
  defaultHandler({
    GET: {
      1: import("./_get"),
    },
    POST: {
      1: import("./_post"),
    },
  })
);
