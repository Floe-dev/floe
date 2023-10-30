import {
  createTRPCProxyClient,
  httpBatchLink,
  getBaseUrl,
} from "@floe/trpc/client";
import type { AppRouter } from "@floe/trpc/server";
import { getAccessToken } from "./accessToken";

export async function getApi() {
  const token = await getAccessToken();

  return createTRPCProxyClient<AppRouter>({
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
