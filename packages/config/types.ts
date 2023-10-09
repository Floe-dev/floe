type Sections = (
  | {
      title?: string;
      pageView: {
        path: string;
      };
    }
  | {
      title?: string;
      pages: Sections;
    }
  | {
      title?: string;
      dataView: {
        path: string;
        direction: "dsc" | "asc";
      };
    }
)[];

export interface Config {
  $schema: string;
  sections: Sections;
}
