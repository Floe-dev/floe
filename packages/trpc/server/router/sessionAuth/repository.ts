import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Endpoints } from "@floe/utils";
import { protectedProcedure, router } from "../../trpc";

type InstallationRepositoriesResponse =
  Endpoints["GET /user/installations/{installation_id}/repositories"]["response"];

export const repositoryRouter = router({
  search: protectedProcedure
    .input(
      z.object({
        installationId: z.number(),
        query: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      let repositoriesResponse: InstallationRepositoriesResponse | undefined;
      let repositories: InstallationRepositoriesResponse["data"]["repositories"] =
        [];
      let page = 1;
      let hasNextPage = true;
      // Stick to a max page count to avoid infinite loops and API abuse
      const maxPage = 10;

      try {
        while (hasNextPage) {
          repositoriesResponse = await ctx.octokit.request(
            "GET /user/installations/{installation_id}/repositories",
            {
              installation_id: input.installationId,
              per_page: 100,
              page,
              headers: {
                "X-GitHub-Api-Version": "2022-11-28",
              },
            }
          );

          repositories = [
            ...repositories,
            ...repositoriesResponse?.data.repositories,
          ];

          const linkHeader = repositoriesResponse?.headers.link;
          if (
            !linkHeader ||
            !linkHeader.includes('rel="next"') ||
            page >= maxPage
          ) {
            hasNextPage = false;
          } else {
            page++;
          }
        }

        const filteredRepositories =
          input.query === ""
            ? repositories
            : repositories.filter((repo) =>
                repo.name
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .includes(input.query.toLowerCase().replace(/\s+/g, ""))
              );

        return filteredRepositories;
      } catch (error) {
        console.log(
          `Failed to fetch repositories for installation ${input.installationId}. Error:`,
          error
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch repositories.",
        });
      }
    }),

  searchBranches: protectedProcedure
    .input(
      z.object({
        owner: z.string(),
        repository: z.string(),
        query: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await ctx.octokit.request(
        "GET /repos/{owner}/{repo}/branches",
        {
          owner: input.owner,
          repo: input.repository,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      const filteredBranches =
        input.query === ""
          ? response.data
          : response.data.filter((branch) =>
              branch.name
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(input.query.toLowerCase().replace(/\s+/g, ""))
            );

      return filteredBranches;
    }),
});
