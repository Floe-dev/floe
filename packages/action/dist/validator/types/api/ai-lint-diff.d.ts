export type AiLintDiffResponse =
  | {
      files: {
        violations: {
          level: "error" | "warn" | undefined;
          description: string | undefined;
          code: string;
          description: string;
          fix: string | undefined;
          startLine: number;
          endLine: number;
          lineContent: string;
        }[];
        filename: string;
      }[];
      cached: boolean;
    }
  | undefined;
//# sourceMappingURL=ai-lint-diff.d.ts.map
