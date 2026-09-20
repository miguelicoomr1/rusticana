import { LOCALES, type Locale } from './locales.ts';

/** Claves de página. Cada una tiene un slug localizado (URLs limpias e indexables por idioma). */
export const PAGE_KEYS = [
  'home',
  'menu',
  'about',
  'gallery',
  'reservations',
  'contact',
  'legal',
  'privacy',
  'cookies',
] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

export const SLUGS: Record<PageKey, Record<Locale, string>> = {
  home: { es: '', en: '', de: '', fr: '', nl: '' },
  menu: { es: 'carta', en: 'menu', de: 'speisekarte', fr: 'carte', nl: 'menukaart' },
  about: { es: 'nosotros', en: 'about-us', de: 'ueber-uns', fr: 'a-propos', nl: 'over-ons' },
  gallery: { es: 'galeria', en: 'gallery', de: 'galerie', fr: 'galerie', nl: 'galerij' },
  reservations: { es: 'reservas', en: 'reservations', de: 'reservierung', fr: 'reservation', nl: 'reserveren' },
  contact: { es: 'contacto', en: 'contact', de: 'kontakt', fr: 'contact', nl: 'contact' },
  legal: { es: 'aviso-legal', en: 'legal-notice', de: 'impressum', fr: 'mentions-legales', nl: 'juridische-informatie' },
  privacy: { es: 'privacidad', en: 'privacy-policy', de: 'datenschutz', fr: 'confidentialite', nl: 'privacybeleid' },
  cookies: { es: 'cookies', en: 'cookie-policy', de: 'cookie-richtlinie', fr: 'politique-cookies', nl: 'cookiebeleid' },
};

/** Subruta de despliegue sin barra final ('' en la raíz, '/rusticana' en GitHub Pages de proyecto). */
export const BASE = ((import.meta.env?.BASE_URL as string | undefined) ?? '/').replace(/\/$/, '');

/** Antepone la subruta de despliegue a una ruta absoluta del sitio. */
export function withBase(p: string): string {
  return `${BASE}${p.startsWith('/') ? p : `/${p}`}`;
}

/** Ruta con barra final y subruta: /es/carta/ (o /rusticana/es/carta/) */
export function pathFor(locale: Locale, key: PageKey): string {
  const slug = SLUGS[key][locale];
  return withBase(slug ? `/${locale}/${slug}/` : `/${locale}/`);
}

/** Devuelve la clave de página y el idioma para un pathname, o null. */
export function resolvePath(pathname: string): { locale: Locale; key: PageKey } | null {
  const rel = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const parts = rel.split('/').filter(Boolean);
  const locale = parts[0] as Locale | undefined;
  if (!locale || !(LOCALES as readonly string[]).includes(locale)) return null;
  const slug = parts[1] ?? '';
  if (parts.length > 2) return null;
  const key = PAGE_KEYS.find((k) => SLUGS[k][locale] === slug);
  return key ? { locale, key } : null;
}
