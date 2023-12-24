export interface Config {
  $schema: string;
  rulesets: Record<
    string,
    {
      include: readonly string[];
      rules: Record<string, "error" | "warn">;
    }
  >;
}
