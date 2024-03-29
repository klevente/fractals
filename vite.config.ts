import { resolve } from "path";
import { defineConfig } from "vite";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        mandelbrot: resolve(root, "mandelbrot", "index.html"),
        cube: resolve(root, "cube", "index.html"),
        terrain: resolve(root, "terrain", "index.html"),
      },
    },
  },
});
