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

  async redirects() {
    return [
      {
        source: "/changelog",
        destination: `/${process.env.NEXT_PUBLIC_FLOE_SLUG}/changelog`,
        permanent: true,
      },
      {
        source: "/blog",
        destination: `/${process.env.NEXT_PUBLIC_FLOE_SLUG}/blog`,
        permanent: true,
      },
    ];
  },
};
