export type AiLintDiffResponse =
  | {
      files: {
        violations: {
          level: "error" | "warn" | undefined;
          description: string | undefined;
          code: string;
          description: string;
          fix: string | undefined;
          startRow: number;
          endRow: number;
          lineContent: string;
        }[];
        filename: string;
      }[];
      cached: boolean;
    }
  | undefined;
//# sourceMappingURL=_get.d.ts.map
