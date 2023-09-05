/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@floe/db", "@floe/utils"],

  async headers() {
    return [
      {
        /**
         * CORS confif for client-side API requests (mostly needed for reactions currently)
         */
        source: "/api/reactions/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          //
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
