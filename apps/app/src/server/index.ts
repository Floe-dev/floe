import { router } from "./trpc";
import { userRouter } from "./router/user";
import { githubRouter } from "./router/github";
import { projectRouter } from "./router/project";
import { dataSourceRouter } from "./router/data-source";
import { repositoryRouter } from "./router/repository";
import { installationRouter } from "./router/installation";

export const appRouter = router({
  user: userRouter,
  github: githubRouter,
  project: projectRouter,
  dataSource: dataSourceRouter,
  repository: repositoryRouter,
  installation: installationRouter,
});

export type AppRouter = typeof appRouter;
