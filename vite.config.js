import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "home.html"),
        about: resolve(__dirname, "about-us.html"),
      },
    },
  },
  base: "/dist/",
});
