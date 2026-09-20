# Product

<!-- impeccable:product-schema 1 -->

<!-- Inferred from the explicit brief (user asked for fully autonomous work, no interview). Items tagged [inferred] were not confirmed by the owner. -->

## Platform

web

## Stack

delegated: Astro (static output, built-in i18n routing, zero-JS by default, image optimisation via sharp) + TypeScript + small vanilla islands; Vitest for tests. Chosen for Core Web Vitals, per-language indexable URLs and cheap static hosting. Deploy target not decided.

## Users

- International residents and holidaymakers of La Manga Club / Atamaría / Los Belones (UK, Germany, Netherlands, Scandinavia, France, Spain — nationality mix to be verified by research) looking for "where to eat / dine tonight" from a phone.
- Local Spanish diners from Cartagena / Los Belones / La Manga.
- Families with children, couples, groups, golfers finishing a round. Job: decide quickly if the place suits them, see when it is open, and book a table (call / WhatsApp / form).

## Product Purpose

Official web presence of Restaurante La Rusticana: convert searches and Maps visits into reservations, express a family restaurant with decades of history, rank locally for La Manga Club dining queries in four-plus languages. Success = calls / WhatsApp / reservation requests and Local SEO visibility.

## Positioning

Family-run since 1986 (opened by a German couple, now run by their daughter Nicole), in the Atamaría hills next to La Manga Club — Mediterranean and international kitchen (German/Austrian influences on the menu: Schnitzel vienés, Stroganoff), terraces, fireplace, own parking, children's play areas. Long-standing local establishment, not a tourist pop-up.

## Operating Context

Restaurant sells by phone and WhatsApp reservation; no booking backend yet. Opening hours are contradictory across sources and change by season [inferred] — must live in one editable config. Menu changes: must be editable through JSON/API later.

## Capabilities and Constraints

- Address: Paraje Atamaría 76 (Ctra. Atamaría 76B per brief), 30385 Cartagena, Murcia. Coordinates 37.6054947, -0.8093213 (from the Google Maps link supplied).
- Phone +34 626 91 90 20. Email larusticanarestaurant@outlook.es (from brief; verify).
- Never invent dishes, prices, allergens, reviews, ratings, fiscal data or social URLs. Anything unverified is left as an owner-to-confirm field.
- Legal entity TAMARINDOS ATAMARIA S.L. (B30763361) only published in legal pages if verified as current operator.
- Languages: es (default), en, de, fr, nl only if research supports; separate indexable URLs, real translations.
- No analytics or embedded maps loaded before consent; no fake GA/GSC IDs.

## Brand Commitments

Name "La Rusticana". Heritage "desde 1986". Family character. Brief binds the aesthetic: Mediterranean + rustic + nature + golf resort + informal elegance; stone, wood, Mediterranean vegetation, earth tones, cream, sand, olive, dark green, terracotta sparingly, off-white; editorial serif headings + very legible sans; no generic black "premium restaurant", no excess gold, no artificial gradients, no floating-card overload, no SaaS look, no tech iconography.

## Evidence on Hand

- Google Maps link and coordinates (brief). Google rating ≈ 4.6 (to be re-verified).
- Public directories confirm phone, address, family history since 1986, ORM "El Rompeolas" episode (23 Sep 2023).
- Official current site is a Webnode page (la-rusticana-restaurante-y-bar1.webnode.es); rusticanalamanga.com no longer resolves (NXDOMAIN, 2026-09-20). It supplied the history text, the tapas/especialidades/bebidas prices and 8 real photographs (src/assets/photos, provenance in docs/IMAGENES.md; owner must confirm reuse). The full carta (entrantes, ensaladas, carnes, pescados, pastas, paellas, pizzas) comes from the menu images the restaurant published.
- Legal holder (razón social / NIF) is NOT verified: the directory-linked company TAMARINDOS ATAMARIA S.L. has a registered address that reads "REST LA FINCA" (a different restaurant). Never publish it without owner confirmation (docs/DATOS.md).
- Opening hours conflict across Google, official site, Tripadvisor and directories; Google (live, claimed profile) is used and flagged disputed.
- Google 4.6 (253 reviews) and Tripadvisor 4.0 (91) read on 2026-09-20; reviews are summarised, never quoted, never marked up as AggregateRating.

## Product Principles

1. Truth over polish: unverified facts stay visibly pending in config, never invented.
2. Reservation is one tap away on every page and every language.
3. A long-lived family restaurant, not a resort-tourist template.
4. Fast and readable on a phone in bright sun: performance and contrast are features.
5. One data source (`restaurant.config`, `menu.json`, `locales/*.json`) drives every page.

## Accessibility & Inclusion

WCAG 2.2 AA target: visible focus, keyboard navigation, reduced-motion support, 44px touch targets, language selector with text labels, correct `lang` per page.
