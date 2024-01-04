import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import type { CustomMiddleware } from "~/types/private-middleware";

const aiEndpoints = ["/api/v1/review"];

const ratelimit = {
  freeMinute: new Ratelimit({
    redis: kv,
    analytics: true,
    prefix: "ai-ratelimit:free",
    limiter: Ratelimit.slidingWindow(100, "60s"), // Temporarily increased to 100 during beta
  }),
  freeDay: new Ratelimit({
    redis: kv,
    analytics: true,
    prefix: "ai-ratelimit:free",
    limiter: Ratelimit.slidingWindow(1000, "86400s"), // Temporarily increased to 1000 during beta
  }),
  proMinute: new Ratelimit({
    redis: kv,
    analytics: true,
    prefix: "ai-ratelimit:pro",
    limiter: Ratelimit.slidingWindow(100, "60s"),
  }),
  proDay: new Ratelimit({
    redis: kv,
    analytics: true,
    prefix: "ai-ratelimit:pro",
    limiter: Ratelimit.slidingWindow(1000, "86400s"),
  }),
};
export const aiRateLimiter: CustomMiddleware = async (req, res, next) => {
  if (req.url && !aiEndpoints.includes(req.url)) {
    await next();
    return;
  }

  const hasSubscription = req.workspace.subscription;
  const { success: successMinute } = hasSubscription
    ? await ratelimit.proMinute.limit(req.workspace.id)
    : await ratelimit.freeMinute.limit(req.workspace.id);

  const { success: successDay } = hasSubscription
    ? await ratelimit.proDay.limit(req.workspace.id)
    : await ratelimit.freeDay.limit(req.workspace.id);

  if (!successMinute || !successDay) {
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
