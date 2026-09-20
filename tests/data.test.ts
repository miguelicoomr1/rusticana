import { describe, it, expect } from 'vitest';
import { restaurant } from '../src/config/restaurant.config.ts';
import { categories, items, formatPrice, hasDietTags } from '../src/lib/menu.ts';
import { openingHoursSpecification, scheduleRows, fmtTime } from '../src/lib/hours.ts';
import { restaurantJsonLd, socialProfiles } from '../src/lib/seo.ts';
import { whatsappHref, telHref, addressLines } from '../src/lib/contact.ts';
import { galleryItems } from '../src/data/gallery.ts';

describe('restaurant.config (NAP y datos)', () => {
  it('NAP coherente con lo contrastado', () => {
    expect(restaurant.displayName).toBe('Restaurante La Rusticana');
    expect(restaurant.phone.display).toBe('+34 626 91 90 20');
    expect(restaurant.phone.e164).toBe('+34626919020');
    expect(restaurant.address.postalCode).toBe('30385');
    expect(addressLines().oneLine).toContain('Paraje Atamaría, 76');
    expect(telHref).toBe('tel:+34626919020');
  });
  it('coordenadas', () => {
    expect(restaurant.geo.latitude).toBeCloseTo(37.6054947, 6);
    expect(restaurant.geo.longitude).toBeCloseTo(-0.8093213, 6);
  });
  it('no hay IDs ficticios de analítica / verificación', () => {
    expect(restaurant.analytics.ga4Id).toBe('');
    expect(restaurant.analytics.gscVerification).toBe('');
  });
  it('datos legales sin verificar NO se publican', () => {
    expect(restaurant.legal.status).toBe('pending');
    expect(restaurant.legal.vatId).toBeNull();
    expect(restaurant.legal.legalName).toBeNull();
  });
  it('WhatsApp usa mensaje predefinido localizado', () => {
    expect(whatsappHref('es')).toContain('wa.me/34626919020?text=');
    expect(decodeURIComponent(whatsappHref('es'))).toContain('reservar una mesa');
    expect(decodeURIComponent(whatsappHref('en'))).toMatch(/book a table/i);
  });
});

describe('menú', () => {
  it('ids únicos y categorías válidas', () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const cats = new Set(categories.map((c) => c.id));
    for (const i of items) expect(cats.has(i.category), i.id).toBe(true);
  });
  it('precios: número positivo, priceText o null (nunca inventado)', () => {
    for (const i of items) {
      if (i.price !== null) expect(i.price, i.id).toBeGreaterThan(0);
      else expect(['zamburinas', 'ens-tropical', 'paella']).toContain(i.id);
    }
  });
  it('sin datos de alérgenos/dieta inventados', () => {
    expect(hasDietTags).toBe(false);
    for (const i of items) {
      expect(i.allergens ?? []).toEqual([]);
      expect(i.tags ?? []).toEqual([]);
    }
  });
  it('categorías con nombre en todos los idiomas', () => {
    for (const c of categories) for (const l of ['es', 'en', 'de', 'fr', 'nl'] as const) expect(c.name[l], `${c.id}:${l}`).toBeTruthy();
  });
  it('formato de precio localizado en EUR', () => {
    expect(formatPrice(22.5, 'es')).toMatch(/22,50\s?€/);
    expect(formatPrice(22.5, 'en')).toMatch(/€22\.50/);
  });
});

describe('horarios y JSON-LD', () => {
  it('cierra lunes y martes', () => {
    const rows = scheduleRows('es', 'Cerrado');
    expect(rows.find((r) => r.day === 1)?.closed).toBe(true);
    expect(rows.find((r) => r.day === 2)?.closed).toBe(true);
    expect(rows.find((r) => r.day === 5)?.closed).toBe(false);
  });
  it('medianoche se muestra 00:00', () => expect(fmtTime('24:00')).toBe('00:00'));
  it('openingHoursSpecification agrupa días iguales', () => {
    const spec = openingHoursSpecification();
    expect(spec.length).toBe(2);
    expect(spec[0].dayOfWeek).toEqual(['Wednesday', 'Thursday', 'Friday', 'Saturday']);
    expect(spec[0].closes).toBe('00:00');
  });
  it('Restaurant JSON-LD: campos requeridos y sin AggregateRating', () => {
    const ld = restaurantJsonLd('es') as Record<string, unknown>;
    expect(ld['@type']).toBe('Restaurant');
    for (const k of ['name', 'image', 'address', 'geo', 'telephone', 'email', 'url', 'servesCuisine', 'hasMenu', 'acceptsReservations', 'sameAs']) expect(ld[k], k).toBeTruthy();
    // horarios en disputa → no se publican en JSON-LD hasta que el propietario los confirme
    expect(restaurant.hours.status).toBe('disputed');
    expect(ld.openingHoursSpecification).toBeUndefined();
    expect(JSON.stringify(ld)).not.toMatch(/aggregateRating|reviewRating/i);
    expect(socialProfiles().every((u) => u.startsWith('https://'))).toBe(true);
  });
});

describe('galería', () => {
  it('las casillas pendientes describen la foto a aportar', () => {
    for (const g of galleryItems) if (!g.photo) expect(g.brief, g.id).toBeTruthy();
  });
});
