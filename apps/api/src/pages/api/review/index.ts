import { defaultHandler } from "~/lib/helpers/default-handler";
import { withMiddleware } from "~/lib/helpers/with-middlware";

export default withMiddleware(
  "authenticate",
  "aiRateLimiter"
)(
  defaultHandler({
    POST: {
      1: import("./_post"),
    },
  })
);
