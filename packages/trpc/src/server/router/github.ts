import { protectedProcedure, router } from "@/server/trpc";
import { getRepositoryContent } from "@floe/utils";
import { z } from "zod";

export const githubRouter = router({
  getConfig: protectedProcedure
    .input(
      z.object({
        owner: z.string(),
        repository: z.string(),
        branch: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      let sections = null;

      try {
        const response = await getRepositoryContent(ctx.octokit, {
          owner: input.owner,
          repo: input.repository,
          path: `.floe/config.json`,
          ref: input.branch,
        });

        sections = JSON.parse(response).sections;
      } catch (e) {
        console.log(".floe/config not found");
      }

      return sections;
    }),
});
