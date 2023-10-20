import { createTRPCProxyClient, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "../server";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3001}`;
}

export const clientOptions = {
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
};

export const api = createTRPCProxyClient<AppRouter>(clientOptions);
