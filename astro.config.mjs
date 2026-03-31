import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://maraielfassi.com',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react(), markdoc(), keystatic()],
  // Vite only loads .env* from here (not repo root). Root `.env` is for the VPS / PM2 only
  // (deploy.sh); otherwise `astro build` tries to open root `.env` and can hit EACCES if
  // permissions/ownership are wrong.
  vite: {
    envDir: path.join(__dirname, 'vite-env'),
  },
});
