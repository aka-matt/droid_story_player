import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  root: command === "serve" ? "demo" : undefined,
  define:
    command === "build"
      ? { "process.env.NODE_ENV": JSON.stringify("production") }
      : undefined,
  build: command === "build"
    ? {
        lib: {
          entry: "src/index.tsx",
          name: "DroidStoryPlayer",
          formats: ["es"],
          fileName: () => "droid-story-player.js"
        },
        rollupOptions: {
          output: {
            inlineDynamicImports: true
          }
        },
        cssCodeSplit: false,
        minify: "esbuild"
      }
    : undefined
}));