export type RootProps = {
  // TODO: can move this into a seperate types package
  post: {
    content: React.ReactNode;
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
    filename: string;
    datasourceId: string;
  };
  children?: React.ReactNode;
};

export type Reaction =
  | "THUMBS_UP"
  | "THUMBS_DOWN"
  | "LAUGH"
  | "HOORAY"
  | "CONFUSED"
  | "HEART"
  | "RANDOM";

export type ReactionsProps = {
  reactions: Partial<{
    [key in Reaction]: number;
  }>;
};

export type ReactionsResponse = {
  data: {
    reactions: {
      type: Reaction;
      count: number;
    }[];
    userReactions: {
      type: Reaction;
      value: boolean;
    }[];
  };
};
