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
export type File = ReturnType<typeof parseDiffToFileHunks>[number];
//# sourceMappingURL=diff-parser.d.ts.map