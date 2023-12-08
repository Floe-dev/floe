import axios from "axios";

export function getBaseUrl() {
  console.log(1111111, process.env.DOCKER_HOST);

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.DOCKER_HOST) {
    return `http://${process.env.DOCKER_HOST}:4000`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 4000}`;
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
