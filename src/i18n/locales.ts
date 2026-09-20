/** Idiomas del sitio. Añadir/quitar aquí (y crear su src/locales/<code>.json) activa/desactiva un idioma. */
export const LOCALES = ['es', 'en', 'de', 'fr', 'nl'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export interface LocaleMeta {
  code: Locale;
  /** Valor para hreflang / atributo lang. */
  hreflang: string;
  /** Nombre en su propio idioma (se muestra en el selector). */
  nativeName: string;
  /** Código corto visible junto al nombre. */
  short: string;
  /** Valor og:locale. */
  ogLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  es: { code: 'es', hreflang: 'es', nativeName: 'Español', short: 'ES', ogLocale: 'es_ES' },
  en: { code: 'en', hreflang: 'en', nativeName: 'English', short: 'EN', ogLocale: 'en_GB' },
  de: { code: 'de', hreflang: 'de', nativeName: 'Deutsch', short: 'DE', ogLocale: 'de_DE' },
  fr: { code: 'fr', hreflang: 'fr', nativeName: 'Français', short: 'FR', ogLocale: 'fr_FR' },
  nl: { code: 'nl', hreflang: 'nl', nativeName: 'Nederlands', short: 'NL', ogLocale: 'nl_NL' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
