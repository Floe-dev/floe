import { label } from "next-api-middleware";
import { qs } from "./qs";
import { authenticate } from "./authenticate";
import { captureErrors } from "./capture-errors";
import { HTTP_DELETE, HTTP_GET, HTTP_PATCH, HTTP_POST } from "./http-methods";

const withPrivateMiddleware = label(
  {
    HTTP_GET,
    HTTP_PATCH,
    HTTP_POST,
    HTTP_DELETE,
    qs,
    authenticate,
    captureErrors,
  },
  // The order matters
  ["qs", "captureErrors", "authenticate"]
);

export { withPrivateMiddleware };
