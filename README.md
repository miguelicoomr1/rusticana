# La Rusticana — sitio web

Web multilingüe (es · en · de · fr · nl) de **Restaurante La Rusticana** — Paraje Atamaría 76, 30385 Cartagena (Atamaría / Los Belones, junto a La Manga Club). Estática, rápida, accesible y optimizada para SEO local.

## Stack
- **Astro 7** (salida estática, cero JS por defecto) + TypeScript estricto. Sin frameworks de UI ni librerías pesadas: JS propio ≈ 10 KB en islas (menú, consentimiento, galería, formulario).
- Imágenes con `astro:assets` (sharp): AVIF + WebP + JPEG, `srcset`, dimensiones explícitas, lazy.
- Tipografías autoalojadas (Brygada 1918 + Hanken Grotesk, solo latin/latin-ext, `font-display: swap`, fallback con métricas).
- Iconos: Lucide + Simple Icons (incrustados en build). Tests: Vitest. Auditoría: ESLint, `astro check`, script propio `verify-dist`, Playwright-core (Chrome) y Lighthouse.

## Arquitectura
```
restaurant.config  →  src/config/restaurant.config.ts   ÚNICA fuente: NAP, coordenadas, horarios, reservas, redes, reseñas, estados de verificación
carta              →  src/data/menu.json (+ src/lib/menu.ts)   platos/precios/etiquetas/alérgenos (JSON; reemplazable por API/CMS)
galería / fotos    →  src/data/gallery.ts, src/data/photos.ts, src/assets/photos/
idiomas            →  src/locales/{es,en,de,fr,nl}.json  ·  src/i18n/{locales,routes,index}.ts
páginas            →  src/pages/[lang]/[...slug].astro (genera 9 páginas × 5 idiomas con slugs localizados) + src/views/*View.astro
componentes        →  src/components/ (Header, LanguageSelector, Hero, AboutPreview, FeaturedDishes, MenuCategory, DishCard, Gallery, Reviews,
                      OpeningHours, LocationMap, ReservationCTA, ReservationForm, MobileActionBar, Footer, CookieConsent, Icon, Logo, Photo…)
SEO                →  src/lib/seo.ts (JSON-LD Restaurant + BreadcrumbList, hreflang), sitemap.xml.ts, robots.txt.ts, manifest.webmanifest.ts
diseño             →  src/styles/global.css (tokens, «pleita»), DESIGN.md, PRODUCT.md
```
URLs indexables por idioma: `/es/`, `/es/carta/`, `/en/menu/`, `/de/speisekarte/`, `/fr/carte/`, `/nl/menukaart/`… con `hreflang` recíproco + `x-default` (→ `/es/`). `/` es una página ligera que detecta el idioma del navegador (o la preferencia guardada) y redirige; el selector permite cambiar siempre.

## Comandos
```bash
npm install
npm run dev            # http://localhost:4321 (muestra también las casillas de foto pendientes)
npm run build          # astro check + astro build → dist/
npm run preview        # sirve dist/ en http://127.0.0.1:4321
npm run lint && npm test
npm run verify         # auditoría estática de dist/ (SEO, hreflang, enlaces, alt, h1, JSON-LD, sitemap…)
npm run qa             # lint + tests + build + verify
# con el preview en marcha:
node scripts/qa-browser.mjs        # 9 anchos × 12 páginas: overflow, consola, imágenes rotas, CLS, objetivos táctiles
node scripts/qa-interactions.mjs   # idioma, menú móvil, formulario, lightbox, consentimiento, mapa, teclado, reduced-motion, 404
npx lighthouse http://127.0.0.1:4321/es/ --only-categories=performance,accessibility,best-practices,seo
```
Requisitos: Node ≥ 22.12. Los scripts de QA usan el Chrome instalado (`playwright-core`, canal `chrome`).

## Variables de entorno (`.env`, ver `.env.example`)
| Variable | Uso |
|---|---|
| `PUBLIC_SITE_URL` | Dominio definitivo (canonical, hreflang, sitemap, OG). **Pendiente**: por defecto `https://larusticana.example` (avisa `verify`). |
| `PUBLIC_GA4_ID` | Google Analytics 4 (`G-…`). Vacío = analítica desactivada (no se carga nada). Solo se carga tras consentimiento. |
| `PUBLIC_GSC_VERIFICATION` | Meta `google-site-verification` de Search Console. |
| `PUBLIC_RESERVATION_ENDPOINT` | Si se define, el formulario hace `POST` JSON (`name, phone, email, date, time, guests, area, notes, allergies, locale`). Vacío = envía por WhatsApp o correo. |
| `PUBLIC_MAPS_EMBED_URL` | URL del iframe de Google Maps (opcional; por defecto `maps.google.com/maps?q=lat,lng&output=embed`). |
| `PUBLIC_SHOW_PHOTO_SLOTS` | `true` muestra en producción las casillas de «foto pendiente». |

## Despliegue
`npm run build` genera `dist/` (HTML estático). Sirve en cualquier hosting estático: **Cloudflare Pages / Netlify** (ya incluye `public/_headers` y `public/_redirects`), Vercel, Nginx/Apache. Pasos: (1) definir `PUBLIC_SITE_URL` (y demás variables) en el panel; (2) build `npm run build`, salida `dist`; (3) apuntar el dominio, HTTPS obligatorio; (4) enviar `https://<dominio>/sitemap.xml` a Search Console; (5) enlazar la web en Google Business Profile. Cachés: `/_astro/*` inmutable 1 año (ya en `_headers`); HTML sin caché larga.

## Cómo cambiar datos
- **Horarios / teléfono / redes / reseñas**: `src/config/restaurant.config.ts`. Al confirmar los horarios, cambiar `hours.status` a `'confirmed'` (quita el aviso y publica `openingHoursSpecification` en JSON-LD).
- **Datos legales**: rellenar `legal.legalName`, `legal.vatId` y poner `legal.status: 'confirmed'` (hasta entonces el Aviso Legal muestra «pendiente»).
- **Carta**: editar `src/data/menu.json` (precio `null` = «Consultar»; añadir `tags`/`allergens` solo con datos reales: los filtros aparecen solos).
- **Textos / idiomas**: `src/locales/*.json` (un test comprueba que todos tienen las mismas claves). Para quitar un idioma: `src/i18n/locales.ts`.
- **Fotos**: ver `docs/IMAGENES.md`.

## Documentación
`docs/DATOS.md` (tabla de investigación, conflictos, datos fiscales), `docs/IMAGENES.md`, `docs/SEO-GBP.md` (recomendaciones), `PRODUCT.md`, `DESIGN.md`.
