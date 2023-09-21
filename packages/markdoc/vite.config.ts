import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: (format) => `index.${format}.js`,
      name: "FloeMarkdoc",
    },
    /**
     * This option will only minify the UMD output. Package users can still see
     * the unminified "index.es.js" output.
     */
    minify: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
