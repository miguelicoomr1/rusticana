// @ts-check
import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL || 'https://larusticana.example';
// Subruta de despliegue (p.ej. GitHub Pages de proyecto: /rusticana). Vacío = raíz del dominio.
const base = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
