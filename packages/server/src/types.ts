import { RenderableTreeNode } from "@markdoc/markdoc";

export type PostContent = {
  owner: string;
  repo: string;
  datasourceId: string;
  imageBasePath: string;
  fileName: string;
  transform: RenderableTreeNode;
  slug: string;
  metadata: {
    title?: string;
    subtitle?: string;
    date?: string;
    image?: string;
    authors?: {
      name: string;
      avatar: string;
      username: string;
    }[];
  };
};

export type PostAPIResponse =
  | {
      data: PostContent[] | PostContent;
    }
  | undefined;

export interface RenderedPostContent extends PostContent {
  content: React.ReactNode;
}

export type PostTreeAPIResponse = {
  data: {
    [key: string]: any;
  };
};

/**
 * TODO: Get types from API programatically
 */
export type ProjectAPIResponse = {
  data: {
    name: string;
    slug: string;
    datasources: {
      id: string;
      branch: string;
      owner: string;
      repo: string;
    }[];
  };
};
