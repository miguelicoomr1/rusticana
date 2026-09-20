import type { APIRoute } from 'astro';
import { restaurant } from '../config/restaurant.config.ts';
import { pathFor, withBase } from '../i18n/index.ts';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: restaurant.displayName,
      short_name: restaurant.name,
      description: restaurant.tagline.es,
      start_url: pathFor('es', 'home'),
      scope: withBase('/'),
      display: 'browser',
      background_color: '#f4eedd',
      theme_color: '#2c3a20',
      lang: 'es',
      icons: [
        { src: withBase('/icon-192.png'), sizes: '192x192', type: 'image/png' },
        { src: withBase('/icon-512.png'), sizes: '512x512', type: 'image/png' },
        { src: withBase('/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } },
  );
