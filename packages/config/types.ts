export interface Config {
  sections: (
    | {
        title: string;
        pageView: {
          path: string;
        };
      }
    | {
        title: string;
        pages: Config["sections"];
      }
    | {
        title: string;
        dataView: {
          path: string;
          direction: "dsc" | "asc";
        };
      }
  )[];
}
