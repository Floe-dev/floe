import { z } from "zod";
import type { Endpoints } from "@octokit/types";
export declare const querySchema: z.ZodObject<{
    path: z.ZodString;
    repo: z.ZodString;
    body: z.ZodString;
    owner: z.ZodString;
    commitId: z.ZodString;
    pullNumber: z.ZodNumber;
    line: z.ZodOptional<z.ZodNumber>;
    startLine: z.ZodOptional<z.ZodNumber>;
    side: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT"]>>;
    startSide: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT"]>>;
}, "strip", z.ZodTypeAny, {
    path: string;
    repo: string;
    body: string;
    owner: string;
    commitId: string;
    pullNumber: number;
    line?: number | undefined;
    startLine?: number | undefined;
    side?: "LEFT" | "RIGHT" | undefined;
    startSide?: "LEFT" | "RIGHT" | undefined;
}, {
    path: string;
    repo: string;
    body: string;
    owner: string;
    commitId: string;
    pullNumber: number;
    line?: number | undefined;
    startLine?: number | undefined;
    side?: "LEFT" | "RIGHT" | undefined;
    startSide?: "LEFT" | "RIGHT" | undefined;
}>;
export type PostGitReviewCommentsResponse = Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"]["response"]["data"];
export type PostReviewCommentsInput = z.infer<typeof querySchema>;
export declare function createGitReviewComment({ path, repo, owner, body, commitId, pullNumber, line, startLine, side, startSide, }: PostReviewCommentsInput): Promise<import("axios").AxiosResponse<{
    url: string;
    pull_request_review_id: number | null;
    id: number;
    node_id: string;
    diff_hunk: string;
    path: string;
    position?: number | undefined;
    original_position?: number | undefined;
    commit_id: string;
    original_commit_id: string;
    in_reply_to_id?: number | undefined;
    user: {
        name?: string | null | undefined;
        email?: string | null | undefined;
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string | null;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
        starred_at?: string | undefined;
    };
    body: string;
    created_at: string;
    updated_at: string;
    html_url: string;
    pull_request_url: string;
    author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
    _links: {
        self: {
            href: string;
        };
        html: {
            href: string;
        };
        pull_request: {
            href: string;
        };
    };
    start_line?: number | null | undefined;
    original_start_line?: number | null | undefined;
    start_side?: "LEFT" | "RIGHT" | null | undefined;
    line?: number | undefined;
    original_line?: number | undefined;
    side?: "LEFT" | "RIGHT" | undefined;
    subject_type?: "line" | "file" | undefined;
    reactions?: {
        url: string;
        total_count: number;
        "+1": number;
        "-1": number;
        laugh: number;
        confused: number;
        heart: number;
        hooray: number;
        eyes: number;
        rocket: number;
    } | undefined;
    body_html?: string | undefined;
    body_text?: string | undefined;
}, any>>;
//# sourceMappingURL=_post.d.ts.map