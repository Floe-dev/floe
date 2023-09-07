const sharedConfig = require("@floe/tailwind-config/tailwind.config.js");

module.exports = {
  darkMode: "class",
  presets: [sharedConfig],
  plugins: [require("@tailwindcss/typography")],
};
