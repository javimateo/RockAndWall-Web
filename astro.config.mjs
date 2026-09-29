// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Dirección pública de la demo: la usan las vistas previas al compartir el enlace
  site: 'https://rockandwall.javiermateo.dev',
  // Las páginas siguen siendo estáticas; solo /api/chat se ejecuta en el servidor
  adapter: node({ mode: 'standalone' }),
});
