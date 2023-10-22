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
      const git = simpleGit();
      const diff = await git.diff();

      console.log(11111, diff);
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

      const template = `
        ---
        title: "My first changelog"
        date: 2023-08-31
        image: /image1.jpg
        ---
        We are excited to announce the release of our new product. It's been a long time coming, but we're finally ready to share it with you!
      `;

      const res = await api.content.generate.query({
        diff,
        template,
      });
      console.log(2222, res);
    });
}
