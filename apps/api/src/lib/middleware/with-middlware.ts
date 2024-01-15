import { label } from "next-api-middleware";
import { qs } from "./qs";
import { authenticate } from "./authenticate";
import { captureErrors } from "./capture-errors";
import { aiRateLimiter } from "./ai-rate-limiter";
import { ipRateLimiter } from "./ip-rate-limiter";

const withMiddleware = label(
  {
    qs,
    authenticate,
    captureErrors,
    aiRateLimiter,
    ipRateLimiter,
  },
  // The order matters
  ["qs", "captureErrors", "ipRateLimiter"]
);

export { withMiddleware };
