import { HttpError } from "@floe/lib/http-error";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import type { CustomMiddleware } from "~/types/middleware";

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
  const hasSubscription = req.workspace.subscription;
  const { success: successMinute } = hasSubscription
    ? await ratelimit.proMinute.limit(req.workspace.id)
    : await ratelimit.freeMinute.limit(req.workspace.id);

  const { success: successDay } = hasSubscription
    ? await ratelimit.proDay.limit(req.workspace.id)
    : await ratelimit.freeDay.limit(req.workspace.id);

  if (!successMinute || !successDay) {
    throw new HttpError({
      statusCode: 429,
      message: "Too Many Requests.",
    });
  }

  await next();
};
