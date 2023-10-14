export function generateURL(
  subdomain: string,
  datasource: string,
  path?: string
) {
  const dynamicPath = [datasource, path].filter(Boolean).join("/");

  if (process.env.NODE_ENV === "production") {
    return `https://${subdomain}.floe.dev/${dynamicPath}`;
  }

  return `http://localhost:3000/${subdomain}/${dynamicPath}`;
}
