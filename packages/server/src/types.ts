import { RenderableTreeNodes } from "@floe/markdoc";

export type PostContent = {
  owner: string;
  repo: string;
  datasourceId: string;
  imageBasePath: string;
  filename: string;
  transform: RenderableTreeNodes;
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

export type Project = {
  name: string;
  description: string | null;
  slug: string;
  logo: string | null;
  favicon: string | null;
  homepageURL: null;
  appearance: "LIGHT" | "DARK" | "SYSTEM";
  primary: string;
  primaryDark: string;
  background: string;
  backgroundDark: string;
  backgroundPattern: string | null;
  customBackground: string | null;
  githubURL: string | null;
  twitterURL: string | null;
  facebookURL: string | null;
  linkedinURL: string | null;
  instagramURL: string | null;
  youtubeURL: string | null;
  discordURL: string | null;
  slackURL: string | null;
  twitchURL: string | null;
  datasources: {
    id: string;
    branch: string;
    owner: string;
    repo: string;
    // TODO: Get programatically
    config: Record<string, any>;
  }[];
};

/**
 * TODO: Get types from API programatically
 */
export type ProjectAPIResponse = {
  data: Project;
};
