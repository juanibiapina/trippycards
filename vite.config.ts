/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    // Only load cloudflare plugin when not in test mode to avoid file handle leaks
    ...(process.env.NODE_ENV !== 'test' ? [cloudflare()] : []),
    tailwindcss()
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    exclude: ["**/node_modules/**", "**/tests/**"],
  },
});
