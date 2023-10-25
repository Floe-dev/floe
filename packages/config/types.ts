type SideNav = (
  | {
      title?: string;
      pageView: {
        path: string;
      };
    }
  | {
      title?: string;
      pages: SideNav;
    }
  | {
      title?: string;
      dataView: {
        path: string;
        direction: "dsc" | "asc";
      };
    }
)[];

type Prompts = {
  [key: string]: {
    instructions: string;
    mock_output: string;
    mock_diff: string;
    mock_commits: string;
  };
};

export interface Config {
  $schema: string;
  prompts?: Prompts;
  sideNav: SideNav;
}
