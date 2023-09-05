import { defaultHandler } from "@/lib/helpers/defaultHandler";
import { withPrivateMiddleware } from "@/lib/helpers/withPrivateMiddlware";

export default withPrivateMiddleware()(
  defaultHandler({
    GET: {
      1: import("./_get"),
    },
  })
);
