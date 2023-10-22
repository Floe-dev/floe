import { router } from "./trpc";
import { githubRouter } from "./router/sessionAuth/github";
import { projectRouter } from "./router/sessionAuth/project";
import { dataSourceRouter } from "./router/sessionAuth/data-source";
import { repositoryRouter } from "./router/sessionAuth/repository";
import { installationRouter } from "./router/sessionAuth/installation";

import { contentRouter } from "./router/tokenAuth/content";
import { dataSourceRouter as tokenDataSourceRouter } from "./router/tokenAuth/data-source";

export const appRouter = router({
  /**
   * Public Auth
   */

  /**
   * Session Auth
   */
  github: githubRouter,
  project: projectRouter,
  dataSource: dataSourceRouter,
  repository: repositoryRouter,
  installation: installationRouter,

  /**
   * Token Auth
   */
  userContent: contentRouter,
  userDataSource: tokenDataSourceRouter,
});

export type AppRouter = typeof appRouter;
