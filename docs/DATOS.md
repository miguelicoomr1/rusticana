# DATOS — investigación y confianza

Fecha de la investigación: **2026-09-20**. Formato: `DATO | VALOR | FUENTE | FECHA | CONFIANZA`
(ALTA · MEDIA · BAJA · CONFLICTO). Nada de esto se ha inventado; lo no verificado queda pendiente.

## 1. Identidad y contacto

| DATO | VALOR | FUENTE | FECHA | CONFIANZA |
|---|---|---|---|---|
| Nombre comercial | Restaurante La Rusticana | Google Business Profile (GBP), web oficial, directorios | 2026-09-20 | ALTA |
| Dirección | Paraje Atamaría, 76, 30385 Cartagena (Murcia) | GBP, viviendolamanga.es | 2026-09-20 | ALTA |
| Dirección (variante) | «Carretera de Atamaría 76B, Los Belones» / «N32, West of La Manga Club» | web oficial Webnode / Tripadvisor | 2026-09-20 | CONFLICTO menor (mismo nº 76; el propietario debe fijar la forma oficial) |
| Código postal | 30385 (también 30389 aparece para Atamaría en otros sitios) | GBP + web oficial | 2026-09-20 | ALTA |
| Coordenadas | 37.6054947, -0.8093213 | URL de Google Maps (`!3d…!4d…`) | 2026-09-20 | ALTA |
| Plus code | J54R+57 | GBP / enlamanga.es | 2026-09-20 | ALTA |
| Teléfono | +34 626 91 90 20 | GBP, web oficial, Tripadvisor | 2026-09-20 | ALTA |
| Teléfonos antiguos | 968 137 258, 968 13 72 58 | enlamanga.es, snippets antiguos | — | BAJA (obsoletos; NO usar) |
| Email | larusticanarestaurant@outlook.es | web oficial, enlamanga.es | 2026-09-20 | ALTA |
| WhatsApp | mismo móvil (+34 626 91 90 20) | **no verificado** que la línea tenga WhatsApp | — | BAJA → confirmar |
| Web oficial actual | https://la-rusticana-restaurante-y-bar1.webnode.es/ (Webnode). `rusticanalamanga.com` ya **no resuelve** (NXDOMAIN) | Restaurant Guru, DNS | 2026-09-20 | ALTA |
| GBP sin web enlazada | «Añadir sitio web» visible | GBP | 2026-09-20 | ALTA → enlazar la nueva web |
| Instagram | @restaurantelarusticanalamanga | Instagram, Restaurant Guru | 2026-09-20 | ALTA |
| Facebook | facebook.com/LaRusticanaLaManga | Facebook, búsquedas | 2026-09-20 | ALTA |
| Tripadvisor | ficha «reclamada», g968389-d4216833 | Tripadvisor | 2026-09-20 | ALTA |

## 2. Historia

| DATO | VALOR | FUENTE | CONFIANZA |
|---|---|---|---|
| Apertura | 1986 («Desde 1986 / 40 años») | web oficial, ORM | ALTA |
| Fundadores | Jens y Reinhilde Dittler (matrimonio alemán) | web oficial (texto propio); ORM confirma «matrimonio alemán» sin nombres | MEDIA-ALTA |
| Actual | su hija Nicole («Nicky/Niki») lleva el negocio | web oficial, ORM (2023), reseñas | ALTA |
| Prensa | ORM «El Rompeolas» – «Rutas gastronómicas por la Trimilenaria: La Rusticana en La Manga Club», emitido 23-sep-2023 | orm.es | ALTA |
| Apellido / titularidad legal | sin registro que vincule «Dittler» o «Nicole» con una sociedad | BORME, einforma, empresite | sin datos |

## 3. Datos fiscales — **NO PUBLICADOS**

`TAMARINDOS ATAMARIA S.L.` (B30763361): existe y está activa (Registro Mercantil de Murcia, hoja MU-49460; admin. solidarios Peter Ingham y Sylvia May Ingham desde 03/04/2025, BORME núm. 70 de 10/04/2025).
**Pero su domicilio social dice «REST LA FINCA», que es otro restaurante** (La Finca, Paraje Atamaría 14). Sociedad hermana: THE FARMHOUSE ATAMARIA S.L. (B30763353), mismo domicilio. Ningún registro, directorio ni la propia web de La Rusticana vinculan estas sociedades con «La Rusticana». Teléfono y número de calle también difieren.
→ **Conclusión: evidencia insuficiente y contraria. Aviso Legal y Privacidad muestran «Pendiente de confirmar por el titular».** El propietario debe indicar razón social y NIF reales y rellenarlos en `src/config/restaurant.config.ts` (`legal`).
(El CNAE 5320 citado en el brief no aparece en ninguna fuente primaria; einforma/empresite dicen 5611.)

## 4. Horarios — **CONFLICTO**

| Fuente | Lun | Mar | Mié | Jue | Vie | Sáb | Dom | Fecha |
|---|---|---|---|---|---|---|---|---|
| **Google Business Profile** (viva) | cerrado | cerrado | 18:30–00:00 | 18:30–00:00 | 18:30–00:00 | 18:30–00:00 | 18:30–23:30 | 2026-09-20 |
| Restaurant Guru / Wanderlog / viviendolamanga | = Google | | | | | | | 2026-09 |
| Web oficial Webnode | cerrado | cerrado | 18:30–23:00 | 18:30–23:00 | 18:30–00:00 | 18:30–00:00 | 18:30–23:00 | sin fecha |
| Tripadvisor | cerrado | cerrado | 18:00–00:00 | 19:00–00:00 | 19:00–00:00 | 19:00–00:00 | 19:00–00:00 | 2026-09-20 |
| enlamanga.es | cerrado | cerrado | cerrado | 18:30–02:00 | 13:00–22:00 | 13:00–22:00 | 13:00–22:00 | sin fecha (obsoleto) |

**Decisión:** se usa Google (perfil reclamado y actualizado hoy, coincide con 3 agregadores). Ninguna fuente fiable muestra apertura a mediodía. Se marca `status: 'disputed'` y la web muestra «horario orientativo, confirma por teléfono». Para cambiarlo: editar `restaurant.hours.schedule` (única fuente; alimenta la web y el JSON-LD).

## 5. Servicios (GBP, 2026-09-20 — ALTA salvo indicación)

Terraza · comer allí y para llevar (sin reparto) · chimenea · música en directo · deportes · comedor privado · grupos · ideal para familias y turistas · menú infantil y tronas · aparcamiento gratuito · acceso, aparcamiento, aseo y asientos accesibles para sillas de ruedas · pago con tarjeta y móvil (NFC) · se aceptan reservas y se recomienda reservar · precio 20–30 € por persona (dato colectivo de Google → no publicado).
Web oficial: parque infantil exterior + zona de juegos interior, salones con chimenea, terrazas, parking propio, «música en directo, fiestas temáticas, noches especiales» durante todo el año, celebraciones (cumpleaños, aniversarios, bodas, comuniones, cenas de empresa), menús para grupos.
**Perros: no consta** en ninguna fuente → no se afirma nada.

## 6. Música en directo

Sin días fijos verificados: «jueves en temporada» (mylamanga.club, sin fecha), «viernes noche» (marenamurray, sin fecha), domingo 17-ago-2026 (reseña Tripadvisor), DJ en verano (reseña 2024). La web dice solo «durante el año… síguenos en redes». → confirmar calendario con el propietario.

## 7. Reseñas (2026-09-20)

Google **4,6 / 253** (194×5★, 35×4★, 12×3★, 4×2★, 8×1★) — Tripadvisor **4,0 / 91** (nº 18 de 32 en Los Belones). Temas positivos recurrentes: trato de la familia (Nicole), terraza y ambiente, croquetas (rabo de toro), arroces/paella, música en directo, parque infantil, aparcamiento fácil. Temas negativos: esperas en días llenos/grupos (2025-26), raciones/precio en algún comentario, música alta (2 menciones). **No hay licencia para reproducir reseñas**: la web solo usa el agregado y temas resumidos, con enlace a las plataformas. Nunca se genera `AggregateRating` en JSON-LD.

## 8. Idiomas de la clientela (idioma original de 164 reseñas con texto en Google)

español ≈70 % · inglés 19 % · alemán 5 % · neerlandés 2,4 % · francés 0,6 % · resto anecdótico. Tripadvisor: mayoritariamente inglés (UK/Irlanda); una reseña en neerlandés (abr 2026). El restaurante lo dirige una familia de origen alemán (una reseña indica que hablan alemán, español e inglés).
**Decisión:** es (principal) + en + de + fr (pedido explícito) + **nl** (más reseñas en neerlandés que en francés; La Manga Club atrae residentes del norte de Europa). Para retirar un idioma basta quitarlo de `src/i18n/locales.ts` (+ su JSON).

## 9. Carta — fuentes y conflictos

Fuentes: (a) web oficial Webnode, páginas *Tapas*, *Especialidades*, *Bebidas* (texto); (b) imágenes de carta publicadas por el restaurante: «Menú» (entrantes, ensaladas, carnes, especialidades, pescados, pastas, paellas, bilingüe ES/EN), «Tapas · Para compartir», «Rusti Pizzas». No hay fecha visible en ninguna. Se han transcrito tal cual; los precios en conflicto se marcan `disputed` en `src/data/menu.json` y se muestra el de la página de texto.

| Plato | Texto web | Imagen «Menú» |
|---|---|---|
| Boquerones en vinagre | 6,50 | 5,20 |
| Solomillo Stroganoff con arroz | 31,50 | 32,50 |
| Schnitzel | 18,00 | 16,00 |
| Pollo al curry | 17,50 | 18,50 |
| Calamar nacional | 22,00 | 22,50 |
| Paletilla | «de cordero al horno» 26,50 | «de cabrito al horno en vino tinto» 34,50 (**otro plato**; no incluido) |
| Paella (marisco / mixta / secreto y boletus) | — | «18,00 € / 16,50 €» (no se sabe cuál es cuál; se muestra el texto tal cual) |

No verificados y **no incluidos**: *Tataki de atún*, *Tortitas* (citados en el brief; no aparecen en ninguna fuente pública). Sin datos: postres, vinos por copa, cócteles, menú del día, opciones veganas/vegetarianas, **alérgenos** (la web declara que no se ofrecen datos y aconseja preguntar al personal). Existe un menú de grupo de 30 € (foto «menu Leila 6.06.25») y una promo «jueves de pizza 1+2 bebidas 15 €» (sin fecha): no publicados por ser puntuales/no verificables.

## 10. Otras discrepancias detectadas

- Tripadvisor 4,0 (91) vs directorios 4,1 (86) / 8,2/10: se usa lo leído hoy en la ficha.
- Google marca «Para llevar: sí»; la web no lo menciona.
- Reseñas mencionan mesa de billar/deportes (1 mención) y «DJ»: no publicados.
