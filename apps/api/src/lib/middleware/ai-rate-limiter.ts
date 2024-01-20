import { HttpError } from "@floe/lib/http-error";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import type { CustomMiddleware } from "~/types/middleware";

const ratelimit = {
  // Free
  freeMinute: new Ratelimit({
    redis: kv,
    analytics: true,
    prefix: "ai-ratelimit:free:minute",
    limiter: Ratelimit.slidingWindow(100, "60s"), // Temporarily increased to 100 during beta
    // limiter: Ratelimit.slidingWindow(5, "60s"),
  }),
  freeDay: new Ratelimit({
    redis: kv,
    analytics: true,
    prefix: "ai-ratelimit:free:day",
    limiter: Ratelimit.slidingWindow(1000, "86400s"), // Temporarily increased to 1000 during beta
    // limiter: Ratelimit.slidingWindow(200, "86400s"),
  }),

  // Pro
  proMinute: new Ratelimit({
    redis: kv,
    analytics: true,
    prefix: "ai-ratelimit:pro:minute",
    limiter: Ratelimit.slidingWindow(50, "60s"),
  }),
  proDay: new Ratelimit({
    redis: kv,
    analytics: true,
    prefix: "ai-ratelimit:pro:day ",
    limiter: Ratelimit.slidingWindow(2000, "86400s"),
  }),

  // Team For team, just rely on the IP rate limiter. If this gets out of hand
  // other rate limiters can be
};

export const aiRateLimiter: CustomMiddleware = async (req, res, next) => {
  const subscription = req.workspace.subscription;
  const hasProSubscription =
    subscription?.priceId === process.env.STRIPE_PRO_PRICE_ID;

  // Has a custom team tier, so can ignore these rate limits
  if (subscription && !hasProSubscription) {
    await next();
  }

  const { success: successMinute } = subscription
    ? await ratelimit.proMinute.limit(req.workspace.id)
    : await ratelimit.freeMinute.limit(req.workspace.id);

  const { success: successDay } = subscription
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
