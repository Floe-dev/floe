import { defaultHandler } from "~/lib/helpers/default-handler";
import { withPrivateMiddleware } from "~/lib/helpers/with-private-middlware";

export default withPrivateMiddleware()(
  defaultHandler({
    POST: {
      1: import("./_post"),
    },
  })
);
