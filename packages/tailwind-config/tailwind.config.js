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
        slideUpAndFade: "slideUpAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)",
        slideDownAndFade:
          "slideDownAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)",
        slideRightAndFade:
          "slideRightAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)",
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

        slideUpAndFade: {
          "0%": { opacity: 0, transform: "translateY(2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideRightAndFade: {
          "0%": { opacity: 0, transform: "translateX(-2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        slideDownAndFade: {
          "0%": { opacity: 0, transform: "translateY(-2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          "0%": { opacity: 0, transform: "translateX(2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
