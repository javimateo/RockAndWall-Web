// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Dirección pública de la demo: la usan las vistas previas al compartir el enlace
  site: 'https://rockandwall.javiermateo.dev',
  // Versiones antiguas de la demo: llevan a la moderna por si alguien guardó el enlace
  redirects: {
    '/mixta': '/moderna',
    '/pro': '/moderna',
    '/clasica': '/moderna',
  },
});
