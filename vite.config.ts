/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    // Only load cloudflare plugin when not in test mode to avoid file handle leaks
    ...(process.env.NODE_ENV !== 'test' ? [cloudflare()] : []),
    tailwindcss(),
    // https://github.com/boristane/website/issues/15#issuecomment-2749444355
    {
      name: 'sql-loader',
      transform(code, id) {
        if (id.endsWith('.sql')) {
          const escapedCode = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')
          return `export default \`${escapedCode}\`;`
        }
      },
    },
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    exclude: ["**/node_modules/**", "**/tests/**"],
    passWithNoTests: true,
  },
});
