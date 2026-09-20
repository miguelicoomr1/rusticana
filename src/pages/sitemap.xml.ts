import type { APIRoute } from 'astro';
import { LOCALES, LOCALE_META, PAGE_KEYS, pathFor, DEFAULT_LOCALE } from '../i18n/index.ts';
import { abs } from '../lib/seo.ts';

const priority: Record<string, string> = { home: '1.0', menu: '0.9', reservations: '0.9', about: '0.7', contact: '0.8', gallery: '0.6' };

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = PAGE_KEYS.flatMap((key) =>
    LOCALES.map((locale) => {
      const alts = [
        ...LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[l].hreflang}" href="${abs(pathFor(l, key))}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(pathFor(DEFAULT_LOCALE, key))}"/>`,
      ].join('\n');
      const freq = key === 'home' || key === 'menu' ? 'weekly' : 'monthly';
      return `  <url>\n    <loc>${abs(pathFor(locale, key))}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority[key] ?? '0.3'}</priority>\n${alts}\n  </url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
