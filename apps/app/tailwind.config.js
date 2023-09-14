const sharedConfig = require("@floe/tailwind-config/tailwind.config.js");
const { withUt } = require("uploadthing/tw");

module.exports = withUt({
  darkMode: "class",
  lightMode: "class",
  presets: [sharedConfig],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{ts,tsx}",
  ],
  plugins: [require("@tailwindcss/typography")],
});
