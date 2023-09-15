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
        "primary-100": "var(--color-primary-100)",
        "primary-200": "var(--color-primary-200)",
        "background-100": "var(--color-background-100)",
        "background-200": "var(--color-background-200)",
      },
    },
  },
};
