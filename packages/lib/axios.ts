import axios from "axios";

export function getBaseUrl() {
  if (process.env.FLOE_API_ENDPOINT)
    // reference for vercel.com
    return process.env.FLOE_API_ENDPOINT;

  // assume localhost
  return "https://api.floe.dev";
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
