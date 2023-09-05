/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      /**
       * Redirects. For more info see: https://stackoverflow.com/questions/65149521/managing-api-versions-using-nextjs-and-vercel
       */
      afterFiles: [
        // This redirects requests recieved at / the root to the /api/ folder.
        {
          source: "/v:version/:rest*",
          destination: "/api/v:version/:rest*",
        },
        // This redirects requests to api/v*/ to /api/ passing version as a query parameter.
        {
          source: "/api/v:version/:rest*",
          destination: "/api/:rest*?version=:version",
        },
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: "/:path*",
          destination: `/api/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
