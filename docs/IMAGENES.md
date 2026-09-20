# IMÁGENES — procedencia y fotos que debe aportar el restaurante

## Fotografías usadas (8) — origen: web oficial del restaurante
Descargadas el 2026-09-20 de la CDN de la web oficial (`la-rusticana-restaurante-y-bar1.webnode.es`, propiedad del propio negocio) por indicación del encargo («prioridad 1: imágenes oficiales»). **El restaurante debe confirmar por escrito que autoriza su uso en la nueva web** (no tienen licencia libre) y, idealmente, entregar los originales en mayor resolución (los actuales son de 1024–1920 px, hechos con móvil).

| Archivo (`src/assets/photos/`) | Original en la web oficial | Contenido | Uso |
|---|---|---|---|
| `terrace-day.jpg` | `rusti 4.jpg` | terraza ajardinada con sombrillas y palmeras | hero, Nosotros |
| `terrace-evening.jpg` | `terraza 1.jpg` | terraza al anochecer, mesas de barril, farolillos (tiene un destello de lente) | Ambiente, Nosotros, OG |
| `dining-room.jpg` | `patio2.jpg` | salón con vigas y suelo de barro | Intro, galería |
| `playground.jpg` | `parque 1.jpg` | parque infantil exterior | Ambiente/Nosotros, galería |
| `dish-squid.jpg` | `comida 1.jpg` | calamar con gambas y salsa verde | plato destacado |
| `dish-paella.jpg` | `comida 5.jpg` | paella | plato destacado |
| `dish-tropical-salad.jpg` | `tropical.jpeg` | ensalada tropical | plato destacado |
| `dish-scallops.jpg` | `zamburiñas.jpeg` | zamburiñas | plato destacado |

No se han usado: el logo de la web oficial (`IMG_0894.png`, 500 px, fondo negro; el nuevo sitio usa una marca propia: sello «R» + banda de pleita), las fotos de carta (son maquetas con texto), ni fotos de Google/Tripadvisor/Instagram/Facebook (derechos de terceros y sin acceso legítimo). No se encontraron imágenes con licencia libre (Wikimedia Commons) de este restaurante.

## Fotos que debe proporcionar el propietario (casillas «pendientes» de la galería)
Se ven en `npm run dev` y con `PUBLIC_SHOW_PHOTO_SLOTS=true`; ocultas en producción hasta que existan. Formato ideal: JPG/PNG horizontal ≥ 2400 px de ancho, sin destellos, luz natural.

1. **Fachada y entrada** a la luz del día, con el cartel visible.
2. **Salón con la chimenea encendida** (invierno).
3. **Música en directo**: actuación con público en la terraza.
4. **Mesa larga de celebración** o cena de grupo.
5. **Zona de juegos interior** (días de lluvia).
6. **Vista de la sierra de Atamaría** y la vegetación mediterránea alrededor.
7. **Nicole y el equipo** en sala.
8. Mejor **foto de portada** (horizontal, 3840×2160): terraza al atardecer con gente, sin destello.
9. Platos hechos a la luz del día: croquetas (incl. rabo de toro), solomillo, schnitzel, pizzas, postres.
10. **Logo** en vector (SVG/PDF) y su versión en positivo/negativo.

## Cómo añadir fotos
1. Copiar el JPG a `src/assets/photos/`.
2. Registrar en `src/data/photos.ts` y, si procede, en `src/data/gallery.ts` (quitar `brief`, añadir `photo`).
3. Añadir su texto alternativo en `src/locales/*.json` → `photos.<clave>` (5 idiomas).
4. `npm run build`: Astro genera AVIF/WebP/JPEG con `srcset`.
