import { defaultHandler } from "@/lib/helpers/defaultHandler";
import { withPublicMiddleware } from "@/lib/helpers/withPublicMiddlware";

export default withPublicMiddleware()(
  defaultHandler({
    GET: {
      1: import("./_get"),
    },
  })
);
