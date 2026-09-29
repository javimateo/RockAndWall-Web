// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Las páginas siguen siendo estáticas; solo /api/chat se ejecuta en el servidor
  adapter: node({ mode: 'standalone' }),
});
