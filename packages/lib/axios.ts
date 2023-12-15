import axios from "axios";

export function getBaseUrl() {
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return process.env.VERCEL_URL;

  // assume localhost
  return "http://localhost:4000";
}

const floeApiSecret = process.env.FLOE_API_SECRET;
const floeApiWorkspace = process.env.FLOE_API_WORKSPACE;

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    ...(floeApiSecret && { "x-api-key": floeApiSecret }),
    ...(floeApiWorkspace && { "x-api-workspace": floeApiWorkspace }),
  },
});
