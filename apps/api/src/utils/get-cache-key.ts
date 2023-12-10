// FORMAT: `<API_VERSION>:<WORKSPACE_SLUG>:<ENDPOINT>:<INPUT>`

export const getCacheKey = (
  version: number,
  workspaceSlug: string,
  endpoint: string,
  hash: string
) => `${version}:${workspaceSlug}:${endpoint}:${hash}`;
