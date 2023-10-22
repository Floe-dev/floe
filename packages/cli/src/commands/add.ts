import { Command } from "commander";
import { getPassword } from "keytar";
import {
  AppRouter,
  createTRPCProxyClient,
  httpBatchLink,
  getBaseUrl,
} from "@floe/trpc/client";
import { simpleGit, CleanOptions } from "simple-git";
import { getAccessToken } from "../utils/accessToken.js";

export function add(program: Command) {
  program
    .command("add")
    .description("Add")
    .action(async () => {
      console.log("Add");
      // const token = await getAccessToken();

      // const api = createTRPCProxyClient<AppRouter>({
      //   links: [
      //     httpBatchLink({
      //       url: `${getBaseUrl()}/api/trpc`,
      //       headers: {
      //         Authorization: token.access_token,
      //       },
      //     }),
      //   ],
      // });

      // const res = await api.content.generate.query();
      // console.log(2222, res);

      const git = simpleGit();
      const diff = await git.diff();

      console.log(11111, diff);
    });
}
