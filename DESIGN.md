---
name: La Rusticana
description: A family restaurant since 1986 as one plaited-esparto object: straw ground, olive fields, braid bands, tied paper tags.
colors:
  straw: "#f4eedd"
  straw-deep: "#ebe2c8"
  straw-line: "#d8ccab"
  esparto: "#d5c28f"
  esparto-deep: "#b39a5b"
  olive-950: "#1c2413"
  olive-900: "#232d18"
  olive-800: "#2c3a20"
  olive-700: "#3c4d2a"
  olive-600: "#4d6035"
  olive-500: "#62733c"
  olive-400: "#8c9a5c"
  olive-300: "#b4bf86"
  ink: "#26281b"
  stone: "#5b5546"
  terracotta: "#a54725"
  terracotta-deep: "#8a3a1c"
  on-olive: "#f4eedd"
  on-olive-muted: "#d3cfb2"
typography:
  display:
    fontFamily: "Brygada 1918, Brygada Fallback, Georgia, serif"
    fontSize: "clamp(3rem, 1.6rem + 6.6vw, 6rem)"
    fontWeight: 580
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Brygada 1918, Brygada Fallback, Georgia, serif"
    fontSize: "clamp(2.1rem, 1.7rem + 1.9vw, 3.4rem)"
    fontWeight: 560
    lineHeight: 1.1
    letterSpacing: "-0.016em"
  title:
    fontFamily: "Brygada 1918, Brygada Fallback, Georgia, serif"
    fontSize: "clamp(1.4rem, 1.3rem + 0.5vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "Hanken Grotesk, Hanken Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.02rem + 0.18vw, 1.1875rem)"
    fontWeight: 420
    lineHeight: 1.6
  label:
    fontFamily: "Hanken Grotesk, Hanken Fallback, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.09em"
rounded:
  hard: "2px"
  tag-end: "14px"
  pill: "999px"
spacing:
  module: "8px"
  s-2: "16px"
  s-4: "32px"
  s-8: "64px"
  gutter: "clamp(1rem, 0.6rem + 2vw, 2rem)"
  section: "clamp(4rem, 3rem + 5vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "#fff9ee"
    typography: "{typography.label}"
    rounded: "{rounded.hard}"
    padding: "0.8rem 1.6rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.terracotta-deep}"
  button-olive:
    backgroundColor: "{colors.olive-800}"
    textColor: "{colors.straw}"
    rounded: "{rounded.hard}"
    padding: "0.8rem 1.6rem"
  button-olive-hover:
    backgroundColor: "{colors.olive-950}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.hard}"
    padding: "0.8rem 1.6rem"
  paper-tag:
    backgroundColor: "{colors.straw-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hard}"
    padding: "0.4rem 1rem 0.4rem 1.85rem"
  input-field:
    backgroundColor: "#fffdf6"
    textColor: "{colors.ink}"
    rounded: "{rounded.hard}"
    padding: "0.65rem 0.85rem"
    height: "3rem"
---

# Design System: La Rusticana

## Overview

**Creative North Star: "Pleita"**

The site is one plaited-esparto object (pleita, the Murcian craft). Straw is the ground, olive is the drenched field, and a two-tone herringbone braid divides sections and frames photographs. Menu categories and dish labels are paper tags with a punched eyelet. Everything is flat, matte, and hard-cornered; the only ornament is the plait itself, which is a real material of the place.

The voice is family and long-standing, not resort-tourist: a warm serif for names and headings, a very legible grotesque for everything read on a phone in sun. Three dyes only: olive, straw/esparto, and terracotta, which is reserved for the reserve action and small marks.

**Key Characteristics:**
- Straw ground with olive-field sections (`.on-olive`) and a straw-deep alternate.
- Plait band as the signature divider and photo frame.
- Scale jump: huge serif names against small grotesque labels.
- Zero shadows, zero gradients as surface treatment, 2px corners.
- One 8px module drives spacing.

## Colors

A three-dye palette: olive greens, straw and esparto tans, one terracotta, with stone-brown and ink for text.

### Primary
- **Olive Field** (olive-800): drenched section fields, header bar over the hero, olive button. Ramp olive-950 to olive-300 provides hover, plait-dark, and tint steps; olive-700 is focus, tag eyelet, input border.

### Secondary
- **Esparto Tan** (esparto, esparto-deep): plait band body and stitch lines, stamp border, active mobile-nav item on olive.
- **Straw** (straw, straw-deep, straw-line): page ground, alternate section ground, hairline rules.

### Tertiary
- **Terracotta** (terracotta, terracotta-deep): the Reservar button, caret, text-link underline, form error/focus. Nothing else.

### Neutral
- **Ink** (ink): body text on straw.
- **Stone** (stone): secondary text on straw.
- **On-olive / On-olive-muted**: text on olive fields.

### Named Rules
**The Three Dyes Rule.** Only olive, straw/esparto, and terracotta appear. Terracotta is the smallest area on any screen and always means act or attention.
**The Field Swap Rule.** Sections switch tone by re-binding `--bg/--fg/--rule/--focus` (`.on-olive`, `.on-straw-deep`), never by ad hoc colors.

## Typography

**Display Font:** Brygada 1918 (with Georgia fallback, metric-matched)
**Body Font:** Hanken Grotesk (with Arial fallback, metric-matched)

**Character:** An editorial serif with italic (used for `em`, translations, secondary names) over a plain, open grotesque. Self-hosted variable fonts, latin and latin-ext.

### Hierarchy
- **Display** (580, 3rem to 6rem fluid, 0.98): the restaurant name in the hero.
- **Headline** (560, 2.1 to 3.4rem, 1.1): section headings (`.h-2`); `.h-1` steps to 2.5-4.5rem for page titles.
- **Title** (600, 1.4 to 1.75rem): sub-headings, mobile-nav links use the same face at 1.75-2.5rem.
- **Body** (420, 1.0625 to 1.1875rem, 1.6): running text, measure 66ch; lede at 1.19-1.375rem.
- **Label** (700, 0.875rem, 0.09em, uppercase): buttons and stamp captions only; small text is 0.8125rem.

### Named Rules
**The Scale Jump Rule.** Big serif against footnote-size grotesque; skip the middle sizes for emphasis.

## Layout

Single column on phones, two-column grids from 64em, 40em, and 48em breakpoints. Container is 78rem (`.wrap`), 52rem for narrow prose, with a fluid gutter (1 to 2rem). Vertical rhythm is section padding clamp(4rem, 3rem + 5vw, 8rem) and a strict 8px module (s-1..s-16). The hero is 100svh on desktop with the panel over the media; below 64em the image stacks over the panel. A fixed header (4.25rem) and a mobile action bar keep reservation one tap away.

## Elevation & Depth

Flat and matte. No box-shadows in the component sources. Depth comes from tone change (straw, straw-deep, olive fields), the plait band, 1px straw-line hairlines, and 10px plait frames around photos. The only overlay effects are the lightbox backdrop and the mobile menu panel.

### Named Rules
**The Flat Rule.** Separate with tone, hairline, or plait; never with a shadow.

## Shapes

Hard corners: 2px on buttons, inputs, frames, stamps, menus. Two intentional exceptions from the world: the paper tag (2px left, 14px right, punched round eyelet) and pill diet tags (999px, 1px olive outline). Borders are 1px hairlines, 1.5 to 2px on controls.

## Components

### Buttons
- **Shape:** hard 2px, 3rem tall (2.75rem small), uppercase 0.875rem/700 with 0.09em tracking.
- **Primary:** terracotta fill, cream text; hover to terracotta-deep; active nudges 1px down.
- **Olive:** olive-800 fill; hover olive-950. **Ghost:** transparent with currentColor border; hover inverts to fg/bg.
- **Focus:** 3px olive outline (esparto on olive), 3px offset.

### Paper tag
Straw-deep tab with 1px straw-line border, 2px/14px asymmetric corners and a hollow eyelet on the left; used for menu categories, reviews, dishes.

### Framed photo
Photographs sit in a 10px plait border with a 1px esparto-deep line.

### Inputs / Fields
- **Style:** near-white fill, 1.5px olive-700 border, 2px corners, 3rem tall.
- **Focus:** 3px terracotta outline. **Error:** terracotta-deep border on pale terracotta wash and bold error text.

### Navigation
Header is straw with hairline, olive over the hero. Links are 0.9375rem/620 with a 2px underline that grows on hover/current. Mobile uses a details/summary full-panel menu in olive with serif links separated by hairlines.

### Plait band
22px braid divider (11px thin, dark variant on olive) as an SVG data URI, repeated x; sits under the header and between sections.

## Do's and Don'ts

### Do:
- **Do** divide sections with the plait band or a tone swap.
- **Do** keep terracotta to the reserve action and small marks.
- **Do** use 2px corners and 1px hairlines.
- **Do** space in multiples of the 8px module.
- **Do** honor `prefers-reduced-motion`; reveals are 0.9s ease-out and visible by default.

### Don't:
- **Don't** use shadows, gradient surfaces, black grounds, or gold.
- **Don't** build card grids or floating cards; use rows, rules, and tags.
- **Don't** introduce a fourth dye or a second accent.
- **Don't** use tech or glyph iconography.
