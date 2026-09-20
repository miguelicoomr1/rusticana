# Recomendaciones SEO y Google Business Profile

## SEO local (ya implementado)
- 5 versiones indexables (`/es/ /en/ /de/ /fr/ /nl/`), slugs localizados, `hreflang` recíproco + `x-default`, canonical por página, sitemap con `xhtml:link`, robots, manifest, 404 propio.
- JSON-LD `Restaurant` (name, address, geo, telephone, email, hasMenu, servesCuisine, acceptsReservations, sameAs, foundingDate) + `BreadcrumbList`. **Sin `AggregateRating`** (no hay licencia para reseñas de terceros). `openingHoursSpecification` y `priceRange` se activan cuando el propietario confirme horarios/precio.
- NAP idéntico en toda la web (cabecera, pie, contacto, JSON-LD, legal) generado desde una sola configuración.
- Contexto geográfico natural: Atamaría, Los Belones, La Manga Club, Cartagena, Región de Murcia.
- Palabras clave trabajadas (title/description/H1/copy, sin relleno): «Restaurante La Rusticana», «Atamaría», «La Manga Club», «restaurante familiar desde 1986», «cocina mediterránea e internacional»; por idioma: *restaurant La Manga Club*, *Restaurant Atamaría*, *Mediterranean restaurant La Manga Club*, *wo essen La Manga Club*, *restaurant Los Belones*, *eten La Manga Club*…

## Pendiente / recomendado
1. **Dominio definitivo** → `PUBLIC_SITE_URL`; redirección 301 desde el dominio antiguo (`rusticanalamanga.com` ya no resuelve; la web Webnode actual debería redirigir a la nueva).
2. **Search Console**: verificar el dominio, enviar `sitemap.xml`, revisar cobertura por idioma y «Internacionalización».
3. **Fotos propias** de calidad (ver `docs/IMAGENES.md`): son el mayor palanca para CTR en Maps y en la web. Añadir texto alternativo descriptivo en 5 idiomas.
4. **Horarios verificados** y calendario de música en directo → activar `openingHoursSpecification` y crear una sección «Agenda» (eventos con `schema.org/Event`).
5. **Carta con alérgenos** reales (obligación legal de informar) → permite filtros vegetariano/vegano/sin gluten y `hasMenu` más rico.
6. **Reseñas**: pedir reseñas en Google/Tripadvisor en varios idiomas (el 70 % son en español, 19 % inglés, 5 % alemán, 2 % neerlandés); responder a todas, sobre todo las de espera/servicio de 2025-26.
7. **Enlaces locales**: alta/actualización en La Manga Club (directorios de restaurantes), enlamanga.es, viviendolamanga.es, Restaurant Guru, Tripadvisor (ficha «reclamada»), Facebook e Instagram (enlazar la nueva web en la bio).
8. **Contenido**: páginas/entradas estacionales (menú de Navidad, jueves de pizza, cenas de grupo/celebraciones) en los 5 idiomas.
9. **Analítica**: crear propiedad GA4 y poner `PUBLIC_GA4_ID`; medir clics en Llamar/WhatsApp/Reservar (los enlaces ya llevan `data-track`).

## Google Business Profile
- **Añadir la web** (hoy la ficha muestra «Añadir sitio web») y un enlace de **reservas** (página `/es/reservas/`) y **carta** (`/es/carta/`).
- Horario: mantener idéntico a la web; usar «horarios especiales» para festivos/temporada. Hoy hay 5 versiones distintas en internet (ver `docs/DATOS.md`).
- Categoría principal *Restaurante*; secundarias: *Restaurante mediterráneo*, *Restaurante europeo*, *Bar*. Atributos ya marcados: terraza, chimenea, música en directo, accesibilidad, familias, grupos, comedor privado, menú infantil, tronas, aparcamiento gratuito, para llevar.
- Subir fotos propias periódicamente (terraza, platos, interior, equipo) y vídeo corto; usar «Del propietario».
- Publicar novedades/eventos semanales (música en directo, noches especiales) con botón «Reservar».
- Confirmar dirección exacta (Paraje Atamaría 76 vs Ctra. de Atamaría 76B) y unificarla en Tripadvisor («N32, West of La Manga Club»).
- Activar mensajes/WhatsApp solo si hay alguien que responda.
