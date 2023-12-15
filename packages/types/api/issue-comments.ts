export type ListIssueCommentsResponse =
  | {
      comments: {
        id: number;
        body: string;
        user: {
          login: string;
        };
        createdAt: string;
        updatedAt: string;
      }[];
    }
  | undefined;
