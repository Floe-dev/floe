import { octokit } from "./octokit";
import { label } from "next-api-middleware";
import { authenticate } from "./authenticate";
import { captureErrors } from "./captureErrors";
import { HTTP_DELETE, HTTP_GET, HTTP_PATCH, HTTP_POST } from "./httpMethods";

const withMiddleware = label(
  {
    HTTP_GET,
    HTTP_PATCH,
    HTTP_POST,
    HTTP_DELETE,
    authenticate,
    octokit,
    captureErrors,
  },
  // The order matters
  ["captureErrors", "authenticate", "octokit"]
);

export { withMiddleware };
