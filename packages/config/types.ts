export interface Config {
  $schema: string;
  reviews?: {
    // Prevent file reviews from surpassing this limit. This avoids accidentally making lots of requests.
    maxFileEvaluations?: number;
    // Prevent diff reviews from surpassing this limit. This avoids accidentally making lots of requests.
    maxDiffEvaluations?: number;
  };
  // Rulesets are used to group rules together.
  rulesets: Record<
    string,
    {
      include: readonly string[];
      rules: Record<string, "error" | "warn">;
    }
  >;
}
