export type AiLintDiffResponse = {
    files: {
        violations: {
            level: "error" | "warn" | undefined;
            description: string | undefined;
            code: string;
            errorDescription: string;
            fix: string | undefined;
            startLine: number;
            endLine: number;
            lineContent: string;
        }[];
        filename: string;
    }[];
    cached: boolean;
} | undefined;
//# sourceMappingURL=_get.d.ts.map