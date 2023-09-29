export function generateURL(
  subdomain: string,
  datasource: string,
  tab: string,
  path: string
) {
  if (process.env.NODE_ENV === "production") {
    return `https://${subdomain}.floe.dev/${datasource}/${tab}/${path}`;
  }

  return `http://localhost:3000/${subdomain}/${datasource}/${tab}/${path}`;
}
