// tailwind config is required for editor support
import sharedConfig from "@floe/tailwind/tailwind.config.js";

const config = {
  presets: [sharedConfig],
  content: [
    "../../packages/ui/**/*.{ts,tsx,md,mdx}",
    "./components/**/*.{ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        garamond: ["var(--font-itc-garamond-std)"],
      },

      animation: {
        blob: "blob-transform 5s ease-in-out infinite both alternate, blob-movement 10s ease-in-out infinite both alternate",
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
            opacity: 0.9,
          },
          "50%": {
            transform: "scale(1.2);",
            opacity: 0.7,
          },
          "100%": {
            transform: "scale(1);",
            opacity: 0.9,
          },
        },
      },

      backgroundImage: {
        noise: "url('/noise.svg')",
      },
    },
  },
};

export default config;
