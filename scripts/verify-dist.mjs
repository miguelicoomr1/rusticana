/**
 * Auditoría estática de dist/: SEO, hreflang, enlaces, imágenes, encabezados, JSON-LD, sitemap, robots.
 * Uso: npm run build && npm run verify   (sale con código 1 si hay errores)
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const BASE = (process.env.PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const LOCALES = ['es', 'en', 'de', 'fr', 'nl'];
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const rel = (p) => path.relative(DIST, p).replaceAll('\\', '/');
const exists = (urlPath) => {
  let clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (BASE && clean.startsWith(BASE)) clean = clean.slice(BASE.length) || '/';
  const p = path.join(DIST, clean);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return true;
  return fs.existsSync(path.join(p, 'index.html'));
};

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const pages = htmlFiles.filter((f) => !['404.html'].includes(rel(f)));
const site = (() => {
  const s = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  return s.match(/<loc>(https?:\/\/[^/]+)/)?.[1] ?? '';
})();

for (const file of pages) {
  const name = rel(file);
  const html = fs.readFileSync(file, 'utf8');
  const isRoot = name === 'index.html';

  const noScript = html.replace(/<script[\s\S]*?<\/script>/g, '');
  if (/lorem ipsum|\[object Object\]|>undefined<|>NaN</i.test(noScript)) err(name, 'texto de relleno / valor roto en el HTML');
  if (/\bTODO\b|\bFIXME\b/.test(noScript)) err(name, 'marcador TODO/FIXME en el HTML');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (!title) err(name, 'sin <title>');
  if (title.length > 70) err(name, `title largo (${title.length})`);
  if (!desc) err(name, 'sin meta description');
  if (desc.length > 170) err(name, `description larga (${desc.length})`);
  if (!/<html lang="[a-z]{2}"/.test(html)) err(name, 'html sin lang');
  if (isRoot) continue;

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) err(name, 'sin canonical');
  else {
    const expected = `${site}${BASE}/${name.replace(/index\.html$/, '')}`;
    if (canonical !== expected) err(name, `canonical ${canonical} != ${expected}`);
  }

  const hre = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  const codes = hre.map((m) => m[1]);
  for (const l of [...LOCALES, 'x-default']) if (!codes.includes(l)) err(name, `falta hreflang ${l}`);
  for (const m of hre) if (!exists(new URL(m[2]).pathname)) err(name, `hreflang apunta a página inexistente ${m[2]}`);
  const self = hre.find((m) => m[2] === canonical);
  if (!self) err(name, 'hreflang no incluye la propia URL');

  for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:locale']) if (!html.includes(`property="${p}"`)) err(name, `falta ${p}`);
  if (!html.includes('name="twitter:card"')) err(name, 'falta twitter:card');
  const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (og && !exists(new URL(og).pathname)) err(name, `og:image no existe (${og})`);
  if (!/name="viewport"/.test(html)) err(name, 'sin viewport');

  const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const h1 = [...body.matchAll(/<h1[\s>]/g)].length;
  if (h1 !== 1) err(name, `${h1} <h1> (debe haber 1)`);
  let last = 0;
  for (const m of body.matchAll(/<h([1-6])[\s>]/g)) {
    const n = Number(m[1]);
    if (last && n > last + 1) err(name, `salto de encabezado h${last} → h${n}`);
    last = n;
  }

  for (const m of body.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt(=|\s|>|\/)/.test(m[0])) err(name, `img sin alt: ${m[0].slice(0, 80)}`);
    if (!/\bwidth=/.test(m[0]) || !/\bheight=/.test(m[0])) warn(name, 'img sin width/height (riesgo de CLS)');
  }
  for (const m of body.matchAll(/<a\b([^>]*)>/g)) {
    const attrs = m[1];
    const href = attrs.match(/href="([^"]*)"/)?.[1];
    if (href === undefined) continue;
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !new RegExp(`id="${id}"`).test(html)) err(name, `ancla rota ${href}`);
    } else if (href.startsWith('/')) {
      if (!exists(href)) err(name, `enlace interno roto ${href}`);
    } else if (/^https?:/.test(href) && /target="_blank"/.test(attrs) && !/rel="[^"]*noopener/.test(attrs)) err(name, `target=_blank sin noopener: ${href}`);
  }
  const labelled = [...body.matchAll(/<label\b[\s\S]*?<\/label>/g)].map((m) => m[0]).join('');
  for (const m of body.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    const a = m[2];
    if (/type="(hidden|submit|button)"/.test(a) || /tabindex="-1"/.test(a)) continue;
    const id = a.match(/\bid="([^"]+)"/)?.[1];
    if (labelled.includes(m[0])) continue;
    if (!id || !new RegExp(`for="${id}"`).test(body)) err(name, `campo sin <label for>: ${a.slice(0, 60)}`);
  }
  for (const m of body.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (!text && !/aria-label=/.test(m[1])) err(name, 'botón sin nombre accesible');
  }

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      if (JSON.stringify(j).match(/aggregateRating/i)) err(name, 'AggregateRating no permitido');
    } catch (e) {
      err(name, `JSON-LD inválido: ${e.message}`);
    }
  }
  if (/\/(es|en|de|fr|nl)\/$/.test(canonical ?? '') && !html.includes('"@type":"Restaurant"')) err(name, 'home sin JSON-LD Restaurant');
}

// robots + sitemap
const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
if (!/Sitemap: https?:\/\//.test(robots)) err('robots.txt', 'sin línea Sitemap');
const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length < LOCALES.length * 9) err('sitemap.xml', `pocas URLs (${locs.length})`);
for (const u of locs) if (!exists(new URL(u).pathname)) err('sitemap.xml', `URL inexistente ${u}`);
for (const f of ['404.html', 'favicon.svg', 'manifest.webmanifest', 'og-image.png', 'apple-touch-icon.png', '_headers']) if (!fs.existsSync(path.join(DIST, f))) err(f, 'falta en dist');
try {
  const man = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.webmanifest'), 'utf8'));
  for (const i of man.icons) if (!exists(i.src)) err('manifest', `icono inexistente ${i.src}`);
} catch (e) {
  err('manifest.webmanifest', e.message);
}

// avisos de configuración pendiente (no rompen el build)
if (site.includes('larusticana.example')) warn('config', 'PUBLIC_SITE_URL sin definir: canonical/sitemap usan el dominio provisional larusticana.example');
const legal = fs.readFileSync(path.join(DIST, 'es/aviso-legal/index.html'), 'utf8');
if (/Pendiente de confirmar por el titular/.test(legal)) warn('aviso-legal', 'razón social y NIF pendientes de confirmar por el titular');

console.log(`Páginas auditadas: ${pages.length} · URLs en sitemap: ${locs.length}`);
if (warnings.length) console.log(`\nAvisos (${warnings.length}):\n - ${[...new Set(warnings)].join('\n - ')}`);
if (errors.length) {
  console.error(`\nERRORES (${errors.length}):\n - ${errors.join('\n - ')}`);
  process.exit(1);
}
console.log('\n✔ verify-dist: sin errores');
