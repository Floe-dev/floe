export type AiLintDiffResponse =
  | {
      files: {
        violations: {
          lineContent: string;
          level: "error" | "warn" | undefined;
          description: string | undefined;
          columns: number[];
          code: string;
          suggestion: string;
          substring: string;
          lineNumber: number;
        }[];
        filename: string;
      }[];
    }
  | undefined;
