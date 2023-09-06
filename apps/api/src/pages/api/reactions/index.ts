import { defaultHandler } from "@/lib/helpers/defaultHandler";
import { withPublicMiddleware } from "@/lib/helpers/withPublicMiddleware";

export default withPublicMiddleware()(
  defaultHandler({
    PUT: {
      1: import("./_put"),
    },
  })
);
