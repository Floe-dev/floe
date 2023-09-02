import { PostContent } from "../types";

export function isNode(
  data: PostContent | PostContent[]
): data is PostContent {
  return !Array.isArray(data as PostContent);
}
