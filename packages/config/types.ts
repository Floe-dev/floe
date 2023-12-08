export interface Config<T extends Record<string, unknown>> {
  $schema: string;
  rules: {
    [key in keyof T]: string;
  };
  ruleSets: Record<
    string,
    {
      include: string[];
      rules: {
        [key in keyof T]: "error" | "warn" | "off";
      };
    }
  >;
}
