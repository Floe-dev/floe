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
        "primary-100": "rgb(var(--color-primary-100) / <alpha-value>)",
        "primary-200": "rgb(var(--color-primary-200) / <alpha-value>)",
        "background-100": "rgb(var(--color-background-100) / <alpha-value>)",
        "background-200": "rgb(var(--color-background-200) / <alpha-value>)",
      },
    },
  },
};
