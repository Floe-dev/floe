export function generateURL(
  subdomain: string,
  datasource: string,
  tab?: string,
  path?: string
) {
  const dynamicPath = [datasource, tab, path].filter(Boolean).join("/");

  if (process.env.NODE_ENV === "production") {
    return `https://${subdomain}.floe.dev/${dynamicPath}`;
  }

  return `http://localhost:3000/${subdomain}/${dynamicPath}`;
}
