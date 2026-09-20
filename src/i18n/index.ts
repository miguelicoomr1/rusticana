import es from '../locales/es.json';
import en from '../locales/en.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import nl from '../locales/nl.json';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from './locales.ts';
import { pathFor, type PageKey } from './routes.ts';
export { PAGE_KEYS, SLUGS, resolvePath } from './routes.ts';

export type Dict = { [key: string]: string | string[] | Dict | Dict[] };

export const dictionaries: Record<Locale, Dict> = { es, en, de, fr, nl } as Record<Locale, Dict>;

function lookup(dict: Dict, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

/** Cadena traducida. Cae al idioma por defecto si falta la clave. Sustituye {marcadores}. */
export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const raw = lookup(dictionaries[locale], key) ?? lookup(dictionaries[DEFAULT_LOCALE], key);
  if (typeof raw !== 'string') {
    if (import.meta.env?.DEV) console.warn(`[i18n] missing string "${key}" (${locale})`);
    return key;
  }
  return vars ? raw.replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? `{${k}}`)) : raw;
}

/** Valor estructurado (array u objeto) traducido, con fallback al idioma por defecto. */
export function tx<T = unknown>(locale: Locale, key: string): T {
  const v = lookup(dictionaries[locale], key) ?? lookup(dictionaries[DEFAULT_LOCALE], key);
  return v as T;
}

/** Traducción de un objeto {es, en, ...} con fallback al español. */
export function pick(value: Partial<Record<Locale, string>> | string | undefined, locale: Locale): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value[DEFAULT_LOCALE] ?? '';
}

export interface Alternate {
  locale: Locale;
  hreflang: string;
  path: string;
}

export function alternatesFor(key: PageKey): Alternate[] {
  return LOCALES.map((locale) => ({ locale, hreflang: LOCALE_META[locale].hreflang, path: pathFor(locale, key) }));
}

export { LOCALES, LOCALE_META, DEFAULT_LOCALE, pathFor };
export type { Locale, PageKey };
