import type { APIRoute } from 'astro';
import { abs } from '../lib/seo.ts';
import { withBase } from '../i18n/index.ts';

export const GET: APIRoute = () =>
  new Response(['User-agent: *', 'Allow: /', '', `Sitemap: ${abs(withBase('/sitemap.xml'))}`, ''].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
