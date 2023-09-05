import { defaultHandler } from "@/lib/helpers/defaultHandler";
import { withMiddleware } from "@/lib/helpers/withMiddlware";

export default withMiddleware(
  defaultHandler({
    GET: import("./_get"),
  })
);
