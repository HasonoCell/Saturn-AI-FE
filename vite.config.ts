import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwind, autoprefixer],
    },
  },
});
