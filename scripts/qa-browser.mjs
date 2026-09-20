/**
 * QA en navegador real (Chrome instalado): overflow horizontal, errores de consola, peticiones fallidas,
 * CLS, imágenes rotas y capturas. Requiere `npm run build && npm run preview` (puerto 4321).
 * Uso: node scripts/qa-browser.mjs [baseUrl]
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:4321';
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const PAGES = ['/es/', '/es/carta/', '/es/nosotros/', '/es/galeria/', '/es/reservas/', '/es/contacto/', '/en/', '/de/', '/fr/', '/nl/', '/es/aviso-legal/', '/es/no-existe/'];
const SHOTS = new Set(['/es/@390', '/es/@1440', '/es/carta/@390', '/es/reservas/@390', '/de/@390', '/es/contacto/@1440']);
fs.mkdirSync('.qa', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const problems = [];
let checks = 0;

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 800 : 900 }, deviceScaleFactor: 1, locale: 'es-ES' });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 }));
      localStorage.setItem('rusticana-lang', document.documentElement.lang || 'es');
    } catch {
      /* ignore */
    }
  });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => m.type() === 'error' && !(p.includes('no-existe') && /404/.test(m.text())) && errs.push(`console: ${m.text()}`));
    page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => errs.push(`requestfailed: ${r.url()}`));
    page.on('response', (r) => r.status() >= 400 && !p.includes('no-existe') && errs.push(`http ${r.status()}: ${r.url()}`));
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__cls += e.value))).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')));
    // recorrer la página para disparar lazy-load y medir CLS real
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const res = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflowX = document.documentElement.scrollWidth - vw;
      const offenders = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width && (r.right > vw + 1 || r.left < -1) && cs.position !== 'fixed' && !el.closest('[hidden], dialog:not([open]), details:not([open]) > *:not(summary), .menu-tabs, .hp, .sr-only')) {
          if (offenders.length < 4) offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} (${Math.round(r.left)}→${Math.round(r.right)})`);
        }
      });
      const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      const small = [...document.querySelectorAll('a, button, summary, select, input:not([type=hidden]), textarea')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && (r.height < 24 || r.width < 24) && !el.closest('.sr-only, .hp, [hidden]') && !(el.tagName === 'A' && cs.display === 'inline');
        })
        .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 20)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`)
        .slice(0, 5);
      return { overflowX, offenders, broken, small, cls: window.__cls || 0, h1: document.querySelectorAll('h1').length, title: document.title };
    });
    checks++;
    const tag = `${p}@${width}`;
    if (res.overflowX > 1) problems.push(`${tag}: overflow horizontal ${res.overflowX}px · ${res.offenders.join(' | ')}`);
    else if (res.offenders.length) problems.push(`${tag}: elementos fuera del viewport · ${res.offenders.join(' | ')}`);
    if (res.broken.length) problems.push(`${tag}: imágenes rotas ${res.broken.join(', ')}`);
    if (res.cls > 0.1) problems.push(`${tag}: CLS ${res.cls.toFixed(3)}`);
    if (res.small.length) problems.push(`${tag}: objetivos táctiles < 24px: ${res.small.join('; ')}`);
    for (const e of errs) problems.push(`${tag}: ${e}`);
    if (SHOTS.has(`${p}@${width}`)) await page.screenshot({ path: `.qa/${p.replaceAll('/', '_')}_${width}.png`, fullPage: true });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`Comprobaciones: ${checks} (páginas × anchos)`);
if (problems.length) {
  console.log(`\nProblemas (${problems.length}):\n - ${[...new Set(problems)].join('\n - ')}`);
  process.exitCode = 1;
} else console.log('\n✔ qa-browser: sin problemas');
