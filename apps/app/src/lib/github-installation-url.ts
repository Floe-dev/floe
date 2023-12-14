import { usePathname, useSearchParams } from "next/navigation";

export function useGitHubInstallationURL(
  workspaceId: string | undefined,
  workspaceSlug: string | undefined
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const arr: string[] = [];

  if (!workspaceId || !workspaceSlug) {
    return null;
  }

  searchParams.forEach((val, key) => {
    arr.push(key, val);
  });

  const valuesToInclude = [workspaceId, workspaceSlug, pathname, ...arr];
  const encodedState = encodeURIComponent(valuesToInclude.join(","));

  return `https://github.com/apps/floe-app/installations/new?state=${encodedState}`;
}

export function parseGitHubInstallationCallback(state: string) {
  const [id, slug, path, ...params] = state
    .split(",")
    .map((value) => decodeURIComponent(value));

  // In the params array, even numbers are keys, while odd numbers are values.
  // Convert to a query string.
  const queryString = params
    .reduce((acc, cur, i) => {
      // If even
      if (i % 2 === 0) {
        return [...acc, `${cur}=${params[i + 1]}`];
      }
      return acc;
    }, [])
    .join("&");

  const url = `${path}${queryString.length ? "?" : ""}${queryString}`;

  return {
    id,
    slug,
    path,
    url,
  };
}
