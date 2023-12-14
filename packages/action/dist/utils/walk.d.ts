export interface WalkEntry {
    path: string;
    parentPath?: string;
}
export declare function walk(dir: string, parentPath?: string): Promise<WalkEntry[]>;
//# sourceMappingURL=walk.d.ts.map