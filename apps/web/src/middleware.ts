// middleware.ts
import { FloeClient } from "@floe/next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getValidSubdomain } from "@/utils/subdomain";

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone();

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next")) return;

  const host = req.headers.get("host");
  const subdomain = getValidSubdomain(host);
  const pathSplit = url.pathname.split("/").filter((x) => x);

  /**
   * This for is for use in production
   */
  if (subdomain) {
    const datasource = pathSplit[0];

    if (datasource) {
      // Subdomain available, rewriting
      console.log(
        `>>> Rewriting: ${url.pathname} to /${subdomain}${url.pathname}`
      );
      url.pathname = `/${subdomain}${url.pathname}`;
    } else {
      // Subdomain, but not datasource available
      const client = FloeClient(subdomain);
      const project = await client.project.get();
      const firstDateSource = project.datasources[0];

      // Subdomain available, redirecting to home
      console.log(
        `>>> Redirecting: ${url.pathname} to /${subdomain}/${firstDateSource.slug}`
      );
      url.pathname = `/${subdomain}/${firstDateSource.slug}`;
    }

    /**
     * This is for use in development
     */
  } else {
    const datasource = pathSplit[1];

    if (pathSplit[0] && !datasource) {
      const client = FloeClient(pathSplit[0]);
      const project = await client.project.get();
      const firstDateSource = project.datasources[0];

      if (!firstDateSource) {
        return;
      }
      // No subdomain, redirecting to home
      console.log(
        `>>> Redirecting: ${url.pathname} to /${pathSplit[0]}/${firstDateSource}`
      );
      url.pathname = `/${pathSplit[0]}/${firstDateSource.slug}`;
    }
  }

  return NextResponse.rewrite(url);
}
