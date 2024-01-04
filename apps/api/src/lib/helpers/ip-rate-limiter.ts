import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { getClientIp } from "request-ip";
import type { Middleware } from "next-api-middleware";

const ratelimit = new Ratelimit({
  redis: kv,
  analytics: true,
  prefix: "ip-ratelimit",
  limiter: Ratelimit.slidingWindow(100, "10s"),
});

export const ipRateLimiter: Middleware = async (req, res, next) => {
  const ip = getClientIp(req);

  if (!ip) {
    await next();
    return;
  }

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    /**
     * By not throwing an error directly we avoid logging the error in Sentry
     */
    res.status(429).json({
      message: "Too Many Requests.",
    });
    return;
  }

  await next();
};
