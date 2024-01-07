/**
 * Returns a list of Files containing Hunks
 */
export declare function parseDiffToFileHunks(diffText: string): {
    path: string;
    hunks: {
        startLine: number;
        content: string;
    }[];
}[];
//# sourceMappingURL=diff-parser.d.ts.map