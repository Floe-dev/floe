import { Command } from "commander";
import { getPassword } from "keytar";
import {
  AppRouter,
  createTRPCProxyClient,
  httpBatchLink,
  getBaseUrl,
} from "@floe/trpc/client";
import { getAccessToken } from "../utils/accessToken.js";

export function add(program: Command) {
  program
    .command("add")
    .description("Add")
    .action(async () => {
      console.log("Add");
      const token = await getAccessToken();

      const api = createTRPCProxyClient<AppRouter>({
        links: [
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            headers: {
              Authorization: token.access_token,
            },
          }),
        ],
      });
      const res = await api.user.test.query();
      console.log("RES: ", res);
    });
}
