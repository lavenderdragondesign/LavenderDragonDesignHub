import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  // IMPORTANT: this app is intended to be served under /upscale
  // (so it can be reverse-proxied from lddtools.lol/upscale without changing the URL).
  base: "/upscale/",
  plugins: [vue()],
  server: {
    port: 5173
  },
  build: {
    // Output into dist/upscale so Netlify can publish "dist" and still serve /upscale/* assets.
    outDir: "dist/upscale",
    sourcemap: false,
    emptyOutDir: true
  }
});
