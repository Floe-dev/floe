// tailwind config is required for editor support
import sharedConfig from "@floe/tailwind/tailwind.config.js";

const config = {
  presets: [sharedConfig],
  content: ["../../packages/ui/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
};

export default config;
