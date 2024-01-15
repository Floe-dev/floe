import { defaultHandler } from "~/lib/middleware/default-handler";
import { withMiddleware } from "~/lib/middleware/with-middlware";

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
