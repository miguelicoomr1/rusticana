import { restaurant, SCHEMA_DAYS, type OpeningSlot } from '../config/restaurant.config.ts';
import type { Locale } from '../i18n/locales.ts';

/** Orden de presentación: lunes … domingo. */
export const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

const dayNameCache = new Map<string, string>();

/** Nombre del día localizado (Intl). 2024-01-07 fue domingo (UTC). */
export function dayName(locale: Locale, day: number, width: 'long' | 'short' = 'long'): string {
  const key = `${locale}:${day}:${width}`;
  const cached = dayNameCache.get(key);
  if (cached) return cached;
  const date = new Date(Date.UTC(2024, 0, 7 + day));
  const name = new Intl.DateTimeFormat(locale, { weekday: width, timeZone: 'UTC' }).format(date);
  const cap = name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  dayNameCache.set(key, cap);
  return cap;
}

export function fmtTime(hhmm: string): string {
  return hhmm === '24:00' ? '00:00' : hhmm;
}

export interface DayRow {
  day: number;
  name: string;
  slots: OpeningSlot[];
  closed: boolean;
  text: string;
}

export function scheduleRows(locale: Locale, closedLabel: string): DayRow[] {
  return DISPLAY_ORDER.map((day) => {
    const slots = restaurant.hours.schedule.filter((s) => s.day === day);
    return {
      day,
      name: dayName(locale, day),
      slots,
      closed: slots.length === 0,
      text: slots.length ? slots.map((s) => `${fmtTime(s.opens)}–${fmtTime(s.closes)}`).join(' · ') : closedLabel,
    };
  });
}

/** Agrupa días con el mismo tramo para schema.org openingHoursSpecification. */
export function openingHoursSpecification() {
  const groups = new Map<string, { days: string[]; opens: string; closes: string }>();
  for (const s of restaurant.hours.schedule) {
    const key = `${s.opens}-${s.closes}`;
    const g = groups.get(key) ?? { days: [], opens: s.opens, closes: s.closes };
    g.days.push(SCHEMA_DAYS[s.day]);
    groups.set(key, g);
  }
  return [...groups.values()].map((g) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: g.days,
    opens: g.opens,
    closes: g.closes === '24:00' ? '00:00' : g.closes,
  }));
}
