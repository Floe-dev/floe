import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  webpack: (c, { isServer }) => {
    if (isServer) {
      c.plugins = [...c.plugins, new PrismaPlugin()];
    }

    return config;
  },
  transpilePackages: ["@floe/ui"],
};

export default config;
