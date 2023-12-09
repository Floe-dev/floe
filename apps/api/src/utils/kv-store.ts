import { Redis } from "@upstash/redis";
import cache from "memory-cache";

class KvStore {
  redis?: Redis;

  constructor() {
    const isProduction = process.env.NODE_ENV === "production";
    const redisUrl = process.env.UPSTASH_REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_TOKEN;

    /**
     * Only use Redis store in production
     */
    if (redisUrl && redisToken && isProduction) {
      this.redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });
    }
  }

  async get(key: string) {
    if (this.redis) {
      return this.redis.hget("myhash", key);
    }
  }

  async set(key: string, value: string) {
    if (this.redis) {
      return this.redis.hset("myhash", { [key]: value });
    }
  }
}
