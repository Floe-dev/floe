export declare const getRulesets: (ruleset?: string) => {
    rules: {
        code: string;
        level: "error" | "warn";
        description: string;
    }[];
    include: readonly string[];
    name: string;
}[];
export type Ruleset = ReturnType<typeof getRulesets>[number];
//# sourceMappingURL=rules.d.ts.map