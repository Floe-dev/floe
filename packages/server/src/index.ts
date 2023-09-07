import api from "./api";
import {
  PostAPIResponse,
  PostTreeAPIResponse,
  ProjectAPIResponse,
} from "./types";
import { Components, render } from "./utils/render";
import { isNode } from "./utils/isNode";

export interface Auth {
  projectSlug: string;
  apiKeySecret: string;
}

export interface Options {
  components: Partial<Components>;
}

export class FloeClientFactory {
  projectSlug: string;
  apiKeySecret: string;
  options?: Options;
  private api;

  constructor(auth: Auth, options?: Options) {
    this.projectSlug = auth.projectSlug;
    this.apiKeySecret = auth.apiKeySecret;
    this.options = options;

    this.api = api(auth.projectSlug, auth.apiKeySecret);
  }

  get project() {
    return {
      get: async () => {
        const response = await this.api<ProjectAPIResponse>(`v1/projects`);

        if (!response) {
          return undefined;
        }

        const { data } = response;

        return data;
      },
    };
  }

  get post() {
    return {
      getListOrNode: async (path: string, datasourceId?: string) => {
        const queryParams = new URLSearchParams({
          path,
          ...(datasourceId && { datasourceId }),
        });

        const response = await this.api<PostAPIResponse>(
          `v1/posts?${queryParams}`
        );

        if (!response) {
          return undefined;
        }

        const { data } = response;

        if (isNode(data)) {
          return {
            isNode: true,
            data: {
              ...data,
              content: render(data.transform, data.imageBasePath, this.options),
            },
          };
        }

        return {
          isNode: false,
          data: data.map((file) => ({
            ...file,
            content: render(file.transform, file.imageBasePath, this.options),
          })),
        };
      },

      getTree: async (path: string, datasourceId?: string) => {
        const queryParams = new URLSearchParams({
          path,
          ...(datasourceId && { datasourceId }),
        });

        const response = await this.api<PostTreeAPIResponse>(
          `v1/posts/tree?${queryParams}`
        );

        if (!response) {
          return undefined;
        }

        const { data } = response;

        return data;
      },
    };
  }
}

const FloeClient = (auth: Auth, options?: Options) =>
  new FloeClientFactory(auth, options);

export default FloeClient;
export * from "./types";
