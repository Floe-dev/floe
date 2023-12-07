import axios from "axios";

export function getBaseUrl() {
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 4000}`;
}

export const getApi = (floeApiSecret: string, floeApiWorkspace: string) =>
  axios.create({
    baseURL: getBaseUrl(),
    headers: {
      ...(floeApiSecret && { "x-api-key": floeApiSecret }),
      ...(floeApiWorkspace && { "x-api-workspace": floeApiWorkspace }),
    },
  });
