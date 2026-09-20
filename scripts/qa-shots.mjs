/** Capturas de viewport por sección para revisión visual. Uso: node scripts/qa-shots.mjs <ruta> <ancho> <y1,y2,...> */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const [route = '/es/', width = '1440', ys = '0'] = process.argv.slice(2);
fs.mkdirSync('.qa', { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: Number(width), height: Number(width) < 700 ? 844 : 900 }, locale: 'es-ES' });
await ctx.addInitScript(() => {
  localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 }));
  localStorage.setItem('rusticana-lang', 'es');
});
const p = await ctx.newPage();
await p.goto(`http://127.0.0.1:4321/${route.replace(/^[/]/, '')}`, { waitUntil: 'networkidle' });
for (const y of ys.split(',').map(Number)) {
  await p.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `.qa/v_${route.replaceAll('/', '_')}_${width}_${y}.png` });
}
await b.close();
