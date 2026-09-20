import data from '../data/menu.json';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales.ts';
import type { PhotoKey } from '../data/photos.ts';

type L10n = Partial<Record<Locale, string>>;

export interface MenuItem {
  id: string;
  category: string;
  /** Nombre tal y como lo publica el restaurante. */
  name: string;
  /** Traducción orientativa del nombre. */
  tr?: L10n;
  desc?: L10n;
  price: number | null;
  priceText?: string;
  unit?: 'unit';
  featured?: boolean;
  photo?: PhotoKey;
  /** Solo si el dato es real (fuente oficial). Vacío = no se muestra filtro. */
  tags?: ('vegetarian' | 'vegan' | 'glutenFree')[];
  allergens?: string[];
  status?: 'confirmed' | 'disputed';
}
export interface MenuCategory {
  id: string;
  name: L10n;
}

export const categories = data.categories as MenuCategory[];
export const items = data.items as MenuItem[];

export function localized(v: L10n | undefined, locale: Locale): string {
  return v?.[locale] ?? v?.[DEFAULT_LOCALE] ?? '';
}

export function formatPrice(price: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(price);
}

export function itemsByCategory() {
  return categories.map((c) => ({ ...c, items: items.filter((i) => i.category === c.id) })).filter((c) => c.items.length);
}

export const featured = items.filter((i) => i.featured);
export const hasDietTags = items.some((i) => i.tags?.length);
