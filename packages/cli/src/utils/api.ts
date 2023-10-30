import { httpBatchLink, createTRPCProxyClient } from "@trpc/react-query";
import { getAccessToken } from "./accessToken";

export function getBaseUrl() {
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3001}`;
}

export async function getApi() {
  const token = await getAccessToken();

  // We cannot import AppRouter here without installing the server package (the server package will intern isntall the DB package, which will cause issues)
  // TODO: Can use TRPC-OpenAPI to get around this issue. Also, can use this for the public API as well.
  // https://github.com/jlalmes/trpc-openapi
  return createTRPCProxyClient<any>({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        headers: {
          Authorization: token.access_token,
        },
      }),
    ],
  });
}
