export function truncate(string: string, n: number, truncateStart = false) {
  if (string.length <= n) {
    return string;
  }

  if (truncateStart) {
    return `...${string.slice(string.length - n, string.length)}`;
  }

  return `${string.slice(0, n - 1)}...`;
}
