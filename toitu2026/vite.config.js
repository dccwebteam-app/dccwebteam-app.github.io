import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite"; // If using Tailwind v4 (or use your PostCSS setup if on v3)
import { tailwindCssObfuscatorVite } from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Keep it enabled only for production builds to make local debugging easy
    tailwindCssObfuscatorVite({
      disabled: false
    }),
  ],
});
