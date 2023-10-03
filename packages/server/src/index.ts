import api from "./api";
import {
  PostAPIResponse,
  TreeAPIResponse,
  ProjectAPIResponse,
  DatasourceAPIResponse,
} from "./types";
import { Components, render } from "@floe/markdoc";
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

  get datasource() {
    return {
      get: async (slug: string) => {
        const response = await this.api<DatasourceAPIResponse>(
          `v1/datasources/${slug}`
        );

        if (!response) {
          return undefined;
        }

        const { data } = response;

        return data;
      },
    };
  }

  get tree() {
    return {
      get: async (path: string, datasourceSlug: string) => {
        const queryParams = new URLSearchParams({
          path,
          ...(datasourceSlug && { datasourceSlug }),
        });

        const response = await this.api<TreeAPIResponse>(
          `v1/tree?${queryParams}`
        );

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
      getListOrNode: async (path: string, datasourceSlug: string) => {
        const queryParams = new URLSearchParams({
          path,
          ...(datasourceSlug && { datasourceSlug }),
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
    };
  }
}

const FloeClient = (auth: Auth, options?: Options) =>
  new FloeClientFactory(auth, options);

export default FloeClient;
export type { Project, Datasource, Tree, RenderedPostContent } from "./types";
