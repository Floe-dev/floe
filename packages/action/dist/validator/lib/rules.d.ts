export declare const getRules: () => {
    rules: Record<string, string>;
    rulesets: Record<string, {
        include: string[];
        rules: Record<string, "error" | "warn" | "off">;
    }>;
    rulesetsWithRules: {
        rules: {
            code: string;
            level: "error" | "warn" | "off";
            description: string;
        }[];
        include: string[];
        name: string;
    }[];
};
//# sourceMappingURL=rules.d.ts.map