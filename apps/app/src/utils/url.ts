import { env } from "~/env.mjs";

export const url =
  env.NODE_ENV === "production" ? env.VERCEL_URL : "http://localhost:3001";
