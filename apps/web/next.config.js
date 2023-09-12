module.exports = {
  reactStrictMode: true,

  transpilePackages: ["@floe/ui", "@floe/next"],

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  images: {
    minimumCacheTTL: 60, // 1 day: 86400
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.floe.dev",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "losthost",
        port: "",
      },
    ],
  },
};
