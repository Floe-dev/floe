const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    `src/app/**/*.{js,ts,jsx,tsx}`,

    // We need this so that Tailwind CSS can be aware of classNames, since we
    // are NOT transpiling inside of the ui packages.
    "../../packages/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob-transform 10s ease-in-out infinite both alternate, blob-movement 10s ease-in-out infinite both alternate",
        "fade-in": "fade-in 0.2s ease",
        "fade-out": "fade-out 0.2s ease",
      },

      keyframes: {
        "blob-transform": {
          "0%": undefined,
          "20%": { "border-radius": "37% 63% 51% 49% / 37% 65% 35% 63%;" },
          "40%": { "border-radius": "36% 64% 64% 36% / 64% 48% 52% 36%;" },
          "60%": { "border-radius": "37% 63% 51% 49% / 30% 30% 70% 70%;" },
          "80%": { "border-radius": "40% 60% 42% 58% / 41% 51% 49% 59%;" },
          "100%": { "border-radius": "33% 67% 70% 30% / 30% 30% 70% 70%;" },
        },

        "blob-movement": {
          "0%": {
            transform: "scale(1);",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1.2);",
            opacity: 0.7,
          },
          "100%": {
            transform: "scale(1);",
            opacity: 1,
          },
        },

        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },

        "fade-out": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
