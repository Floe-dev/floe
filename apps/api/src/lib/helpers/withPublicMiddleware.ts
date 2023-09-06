import { octokit } from "./octokit";
import { label } from "next-api-middleware";
import { captureErrors } from "./captureErrors";
import { HTTP_DELETE, HTTP_GET, HTTP_PATCH, HTTP_POST } from "./httpMethods";

const withPublicMiddleware = label(
  {
    HTTP_GET,
    HTTP_PATCH,
    HTTP_POST,
    HTTP_DELETE,
    captureErrors,
  },
  // The order matters
  ["captureErrors"]
);

export { withPublicMiddleware };
