const sharedConfig = require("@floe/tailwind-config/tailwind.config.js");

module.exports = {
  content: [
    `src/app/**/*.{js,ts,jsx,tsx}`,
    "src/components/**/*.{js,ts,jsx,tsx}",

    // We need this so that Tailwind CSS can be aware of classNames, since we
    // are NOT transpiling inside of the ui packages.
    "../../packages/ui/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  presets: [sharedConfig],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        background: "var(--color-background)",
      },
    },
  },
};
