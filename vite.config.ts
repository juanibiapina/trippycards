/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from '@tailwindcss/vite';
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

// SQL loader plugin to handle .sql file imports
function createSqlLoaderPlugin() {
  // https://github.com/boristane/website/issues/15#issuecomment-2749444355
  return {
    name: 'sql-loader',
    transform(code: string, id: string) {
      if (id.endsWith('.sql')) {
        const escapedCode = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')
        return `export default \`${escapedCode}\`;`
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    // Only load cloudflare plugin when not in test mode to avoid file handle leaks
    ...(process.env.NODE_ENV !== 'test' ? [cloudflare()] : []),
    tailwindcss(),
    createSqlLoaderPlugin(),
  ],
  test: {
    projects: [
      // React/Frontend tests - runs in jsdom environment
      {
        // Inherit options from the main config like plugins
        extends: true,
        test: {
          name: 'react',
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          globals: true,
          include: ["src/react-app/**/*.{test,spec}.{ts,tsx}"],
          exclude: ["**/node_modules/**", "**/tests/**", "**/test/**"],
        },
      },

      // Worker tests - runs in Cloudflare workers environment
      defineWorkersConfig({
        plugins: [
          createSqlLoaderPlugin(),
        ],
        test: {
          name: 'worker',
          include: ["src/worker/**/*.{test,spec}.{ts,tsx}", "test/**/*.{test,spec}.{ts,tsx}"],
          exclude: ["**/node_modules/**", "**/tests/**"],
          poolOptions: {
            workers: {
              wrangler: { configPath: "./wrangler.json" },
            },
          },
        },
      }),
    ],
  },
});
