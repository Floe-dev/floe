/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@floe/db", "@floe/utils"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
