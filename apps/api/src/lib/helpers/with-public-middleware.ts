import { label } from "next-api-middleware";
import { qs } from "./qs";
import { captureErrors } from "./capture-errors";
import { HTTP_DELETE, HTTP_GET, HTTP_PATCH, HTTP_POST } from "./http-methods";

const withPublicMiddleware = label(
  {
    HTTP_GET,
    HTTP_PATCH,
    HTTP_POST,
    HTTP_DELETE,
    captureErrors,
    qs,
  },
  // The order matters
  ["qs", "captureErrors"]
);

export { withPublicMiddleware };
