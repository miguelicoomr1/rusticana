/** Captura de página completa (imágenes cargadas) → .impeccable/review/. Uso: node scripts/qa-full.mjs es/ 1440 desktop */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const [route = 'es/', width = '1440', name = 'desktop'] = process.argv.slice(2);
fs.mkdirSync('.impeccable/review', { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: Number(width), height: Number(width) < 700 ? 844 : 900 }, locale: 'es-ES' });
await ctx.addInitScript(() => {
  localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 }));
  localStorage.setItem('rusticana-lang', 'es');
});
const p = await ctx.newPage();
await p.goto(`http://127.0.0.1:4321/${route.replace(/^[/]/, '')}`, { waitUntil: 'networkidle' });
await p.addStyleTag({ content: '*{scroll-behavior:auto!important} .hero__media,.hero__media img{animation:none!important}' });
await p.evaluate(async () => {
  document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
  document.querySelectorAll('.reveal').forEach((e) => {
    e.style.transition = 'none';
    e.classList.add('is-in');
  });
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  window.scrollTo(0, 0);
});
await p.waitForTimeout(600);
await p.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
await b.close();
console.log('ok', name);
