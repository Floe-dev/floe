import { defaultHandler } from "@/lib/helpers/defaultHandler";
import { withMiddleware } from "@/lib/helpers/withMiddlware";

export default withMiddleware()(
  defaultHandler({
    GET: {
      1: import("./_get"),
      2: import("./_get-v2"),
    },
  })
);
