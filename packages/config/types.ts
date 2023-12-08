export interface Config {
  $schema: string;
  rules: Record<string, string>;
  rulesets: Record<
    string,
    {
      include: string[];
      rules: Record<string, "error" | "warn" | "off">;
    }
  >;
}
