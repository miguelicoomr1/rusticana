import type { APIRoute } from 'astro';
import { abs } from '../lib/seo.ts';

export const GET: APIRoute = () =>
  new Response(['User-agent: *', 'Allow: /', '', `Sitemap: ${abs('/sitemap.xml')}`, ''].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
