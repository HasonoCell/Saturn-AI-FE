import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  css: {
    postcss: {
      plugins: [tailwind, autoprefixer],
    },
  },
});