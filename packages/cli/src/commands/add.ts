import { Command } from "commander";
import { simpleGit, CleanOptions } from "simple-git";
import { getApi } from "../utils/api.js";

export function add(program: Command) {
  program
    .command("add")
    .description("Add")
    .action(async () => {
      const git = simpleGit();
      const diff = await git.diff();

      const api = await getApi();

      const template = `
        ---
        title: "My first changelog"
        date: 2023-08-31
        image: /image1.jpg
        ---
        We are excited to announce the release of our new product. It's been a long time coming, but we're finally ready to share it with you!
      `;

      const res = await api.userContent.generate.query({
        diff,
        template,
      });
      console.log(2222, res);
    });
}
