/** Pruebas funcionales en navegador real: idioma, menú móvil, formulario, galería, consentimiento, mapa, teclado, reduced-motion. */
import { chromium } from 'playwright-core';

const BASE = 'http://127.0.0.1:4321';
const results = [];
const ok = (name, cond, extra = '') => results.push({ name, pass: !!cond, extra: cond ? '' : String(extra) });
const b = await chromium.launch({ channel: 'chrome', headless: true });

async function fresh(opts = {}, init) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-ES', ...opts });
  if (init) await ctx.addInitScript(init);
  return ctx;
}

// 1 · raíz: detección de idioma del navegador y preferencia guardada
{
  const ctx = await fresh({ locale: 'de-DE' });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'load' });
  await p.waitForURL('**/de/', { timeout: 5000 }).catch(() => {});
  ok('raíz redirige a /de/ con navegador alemán', p.url().endsWith('/de/'), p.url());
  await ctx.close();
  const ctx2 = await fresh({ locale: 'de-DE' }, () => localStorage.setItem('rusticana-lang', 'fr'));
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + '/', { waitUntil: 'load' });
  await p2.waitForURL('**/fr/', { timeout: 5000 }).catch(() => {});
  ok('la preferencia guardada gana al idioma del navegador', p2.url().endsWith('/fr/'), p2.url());
  await ctx2.close();
}

// 2 · selector de idioma (teclado + enlace real) y guardado
{
  const ctx = await fresh({}, () => localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 })));
  const p = await ctx.newPage();
  await p.goto(BASE + '/es/carta/');
  await p.click('.lang__button');
  const hrefs = await p.$$eval('.lang__list a', (as) => as.map((a) => a.getAttribute('href')));
  ok('selector: 5 idiomas con URL de la misma página', hrefs.length === 5 && hrefs.includes('/en/menu/') && hrefs.includes('/de/speisekarte/') && hrefs.includes('/fr/carte/') && hrefs.includes('/nl/menukaart/'), hrefs.join());
  await p.click('.lang__list a[data-lang-link="de"]');
  await p.waitForURL('**/de/speisekarte/');
  ok('cambiar a alemán navega y guarda preferencia', (await p.evaluate(() => localStorage.getItem('rusticana-lang'))) === 'de');
  ok('html lang="de"', (await p.getAttribute('html', 'lang')) === 'de');
  await ctx.close();
}

// 3 · teclado: primer Tab = enlace de salto; foco visible
{
  const ctx = await fresh({}, () => localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 })));
  const p = await ctx.newPage();
  await p.goto(BASE + '/es/');
  await p.keyboard.press('Tab');
  const first = await p.evaluate(() => ({ t: document.activeElement?.textContent?.trim(), o: getComputedStyle(document.activeElement).outlineStyle }));
  ok('primer Tab: "Saltar al contenido"', /Saltar al contenido/.test(first.t || ''), first.t);
  await p.keyboard.press('Enter');
  ok('el enlace de salto mueve el foco a main', await p.evaluate(() => document.activeElement?.id === 'contenido'));
  await p.keyboard.press('Tab');
  const o = await p.evaluate(() => getComputedStyle(document.activeElement).outlineWidth);
  ok('foco visible (outline ≥ 2px)', parseFloat(o) >= 2, o);
  await ctx.close();
}

// 4 · menú móvil
{
  const ctx = await fresh({ viewport: { width: 390, height: 844 }, hasTouch: true }, () => localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 })));
  const p = await ctx.newPage();
  await p.goto(BASE + '/es/');
  await p.click('.mnav__button');
  ok('menú móvil abre y muestra navegación', await p.isVisible('.mnav__panel nav a[href="/es/carta/"]'));
  ok('menú móvil incluye selector de idioma visible', await p.isVisible('.mnav__panel .lang-inline'));
  await p.keyboard.press('Escape');
  ok('Escape cierra el menú móvil', !(await p.isVisible('.mnav__panel')));
  ok('barra móvil inferior: Llamar / Reservar / Cómo llegar', (await p.$$eval('.mobile-bar a', (a) => a.map((x) => x.textContent.trim().toLowerCase()))).join('|') === 'llamar|reservar|cómo llegar');
  const tel = await p.getAttribute('.mobile-bar a', 'href');
  ok('Llamar usa tel:+34626919020', tel === 'tel:+34626919020', tel);
  await ctx.close();
}

// 5 · formulario de reservas
{
  const ctx = await fresh({}, () => localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 })));
  const p = await ctx.newPage();
  await p.goto(BASE + '/es/reservas/');
  await p.click('[data-submit="whatsapp"]');
  const errCount = await p.$$eval('.field__err', (e) => e.filter((x) => x.textContent.trim()).length);
  ok('formulario vacío muestra errores (nombre, teléfono, fecha, consentimiento)', errCount >= 3, errCount);
  ok('foco al primer campo con error', await p.evaluate(() => document.activeElement?.id === 'rf-name'));
  await p.fill('#rf-name', 'Ana Prueba');
  await p.fill('#rf-phone', '12');
  await p.click('[data-submit="whatsapp"]');
  ok('teléfono corto rechazado', /válido/.test(await p.textContent('#rf-phone-err')));
  await p.fill('#rf-phone', '+34 600 111 222');
  const d = new Date();
  d.setDate(d.getDate() + 3);
  await p.fill('#rf-date', d.toISOString().slice(0, 10));
  await p.selectOption('#rf-time', '20:30');
  await p.selectOption('#rf-guests', '4');
  await p.selectOption('#rf-area', 'terrace');
  await p.fill('#rf-allergies', 'Frutos secos');
  await p.check('#rf-consent');
  const popupPromise = ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null);
  await p.click('[data-submit="whatsapp"]');
  const popup = await popupPromise;
  const url = popup ? popup.url() : '';
  const text = decodeURIComponent((url.split('text=')[1] || '').replace(/[+]/g, ' '));
  ok('WhatsApp abre wa.me con el número del restaurante', /(wa\.me\/|phone=)34626919020/.test(url), url.slice(0, 80));
  ok('el mensaje incluye nombre, hora, personas, zona y alergias', /Ana Prueba/.test(text) && /20:30/.test(text) && /Personas: 4/.test(text) && /Terraza/.test(text) && /Frutos secos/.test(text), text.slice(0, 200));
  ok('mensaje en español', /reservar una mesa/.test(text));
  ok('estado accesible tras enviar', /WhatsApp/.test(await p.textContent('[data-status]')));
  await ctx.close();
  const ctx2 = await fresh({}, () => localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 })));
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + '/en/reservations/');
  await p2.fill('#rf-name', 'Tim');
  await p2.fill('#rf-phone', '+44 7700 900123');
  const d2 = new Date();
  d2.setDate(d2.getDate() + 2);
  await p2.fill('#rf-date', d2.toISOString().slice(0, 10));
  await p2.check('#rf-consent');
  const pp = ctx2.waitForEvent('page', { timeout: 4000 }).catch(() => null);
  await p2.click('[data-submit="whatsapp"]');
  const pop2 = await pp;
  ok('mensaje de WhatsApp localizado (en)', pop2 && /book a table/i.test(decodeURIComponent(pop2.url().replace(/[+]/g, ' '))), pop2 ? pop2.url().slice(0, 120) : 'sin popup');
  await ctx2.close();
}

// 6 · galería: lightbox (dialog), teclado, contador
{
  const ctx = await fresh({}, () => localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 })));
  const p = await ctx.newPage();
  await p.goto(BASE + '/es/galeria/');
  const tiles = await p.$$eval('.gal__open', (e) => e.length);
  ok('galería: 8 fotos reales, sin casillas pendientes en producción', tiles === 8 && (await p.$$eval('.gal__slot', (e) => e.length)) === 0, tiles);
  await p.click('.gal__open >> nth=0');
  ok('lightbox abre (dialog modal)', await p.evaluate(() => document.querySelector('[data-lightbox]').open));
  const c1 = await p.textContent('[data-lb-count]');
  await p.keyboard.press('ArrowRight');
  const c2 = await p.textContent('[data-lb-count]');
  ok('flecha derecha avanza', c1 !== c2, `${c1} → ${c2}`);
  ok('lightbox muestra alt/pie', (await p.textContent('[data-lb-caption]')).length > 10);
  await p.keyboard.press('Escape');
  ok('Escape cierra y devuelve foco al botón', await p.evaluate(() => !document.querySelector('[data-lightbox]').open && document.activeElement?.classList.contains('gal__open')));
  await p.click('[data-filter="food"]');
  ok('filtro Gastronomía oculta el resto', (await p.$$eval('.gal__item:not([hidden])', (e) => e.length)) === 4);
  await ctx.close();
}

// 7 · consentimiento: nada opcional antes de aceptar; iframe del mapa tras consentimiento
{
  const ctx = await fresh();
  const p = await ctx.newPage();
  const reqs = [];
  p.on('request', (r) => reqs.push(r.url()));
  await p.goto(BASE + '/es/contacto/', { waitUntil: 'networkidle' });
  ok('sin consentimiento no se cargan google/analytics', !reqs.some((u) => /google|gstatic|googletagmanager/.test(u)), reqs.filter((u) => /google/.test(u)).join());
  ok('sin iframe de mapa antes del consentimiento', (await p.$$eval('iframe', (f) => f.length)) === 0);
  await p.mouse.wheel(0, 400);
  await p.waitForSelector('[data-consent]:not([hidden])', { timeout: 3000 }).catch(() => {});
  ok('el aviso de cookies aparece en la primera interacción', await p.isVisible('[data-consent-panel]'));
  await p.click('[data-consent-reject]');
  ok('rechazar guarda maps:false', (await p.evaluate(() => JSON.parse(localStorage.getItem('rusticana-consent')).maps)) === false);
  ok('tras rechazar no hay iframe', (await p.$$eval('iframe', (f) => f.length)) === 0);
  await p.click('[data-consent-open]');
  ok('"Preferencias de cookies" reabre el panel', await p.isVisible('[data-consent-details]'));
  await p.check('[data-consent-maps]');
  await p.click('[data-consent-save]');
  await p.waitForSelector('iframe', { timeout: 4000 }).catch(() => {});
  ok('con consentimiento de mapas se carga el iframe', (await p.$$eval('iframe', (f) => f.length)) === 1);
  await ctx.close();
}

// 8 · reduced motion
{
  const ctx = await fresh({ reducedMotion: 'reduce' }, () => localStorage.setItem('rusticana-consent', JSON.stringify({ v: 1, analytics: false, maps: false, ts: 1 })));
  const p = await ctx.newPage();
  await p.goto(BASE + '/es/');
  const op = await p.evaluate(() => getComputedStyle(document.querySelector('.reveal')).opacity);
  ok('reduced-motion: contenido visible sin animación', op === '1', op);
  const an = await p.evaluate(() => getComputedStyle(document.querySelector('.hero__lead')).animationName);
  ok('reduced-motion: sin animación en el hero', an === 'none', an);
  await ctx.close();
}

// 9 · 404
{
  const ctx = await fresh({}, undefined);
  const p = await ctx.newPage();
  const r = await p.goto(BASE + '/en/nothing-here/');
  ok('404 devuelve estado 404', r.status() === 404, r.status());
  ok('404 en inglés según la ruta', await p.isVisible('.nf__block[data-lang-block="en"] h1'));
  await ctx.close();
}

await b.close();
const failed = results.filter((r) => !r.pass);
for (const r of results) console.log(`${r.pass ? '✔' : '✘'} ${r.name}${r.pass ? '' : '  → ' + r.extra}`);
console.log(`\n${results.length - failed.length}/${results.length} correctas`);
process.exit(failed.length ? 1 : 0);
