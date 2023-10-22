import { router } from "./trpc";
import { githubRouter } from "./router/github";
import { contentRouter } from "./router/content";
import { projectRouter } from "./router/project";
import { dataSourceRouter } from "./router/data-source";
import { repositoryRouter } from "./router/repository";
import { installationRouter } from "./router/installation";

export const appRouter = router({
  github: githubRouter,
  content: contentRouter,
  project: projectRouter,
  dataSource: dataSourceRouter,
  repository: repositoryRouter,
  installation: installationRouter,
});

export type AppRouter = typeof appRouter;
