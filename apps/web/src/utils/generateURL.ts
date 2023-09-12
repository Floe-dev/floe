export function generateURL(subdomain: string, slug: string) {
  if (process.env.NODE_ENV === "production") {
    return `https://${subdomain}.floe.dev/${slug}`;
  }

  return `http://localhost:3000/${subdomain}/${slug}`;
}
