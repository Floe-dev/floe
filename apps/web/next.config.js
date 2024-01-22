const { withNextVideo } = require("next-video/process");

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

const withNextraConfig = withNextra({
  reactStrictMode: false,
  transpilePackages: ["@floe/ui"],
});

module.exports = withNextVideo(withNextraConfig, {
  provider: "vercel-blob",
});
