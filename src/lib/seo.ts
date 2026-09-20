import { restaurant } from '../config/restaurant.config.ts';
import { openingHoursSpecification } from './hours.ts';
import { alternatesFor, pathFor, t, withBase, LOCALE_META, type Locale, type PageKey } from '../i18n/index.ts';

export const SITE = restaurant.site.url.replace(/\/$/, '');

export function abs(path: string): string {
  return path.startsWith('http') ? path : `${SITE}${path}`;
}

export const OG_IMAGE_PATH = '/og-image.png';

export function socialProfiles(): string[] {
  const s = restaurant.social;
  return [s.instagram, s.facebook, s.tripadvisor].filter((p) => p.status === 'confirmed').map((p) => p.url);
}

/** JSON-LD Restaurant. Solo datos verificados; sin AggregateRating. */
export function restaurantJsonLd(locale: Locale) {
  const r = restaurant;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${abs(withBase('/'))}#restaurant`,
    name: r.displayName,
    alternateName: r.name,
    description: t(locale, 'seo.schemaDescription'),
    url: abs(pathFor(locale, 'home')),
    image: [abs(withBase(OG_IMAGE_PATH))],
    telephone: r.phone.e164,
    email: r.email.address,
    foundingDate: String(r.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.address.streetAddress,
      postalCode: r.address.postalCode,
      addressLocality: r.address.addressLocality,
      addressRegion: r.address.addressRegion,
      addressCountry: r.address.addressCountry,
    },
    geo: { '@type': 'GeoCoordinates', latitude: r.geo.latitude, longitude: r.geo.longitude },
    hasMap: r.maps.placeUrl,
    ...(r.hours.status === 'confirmed' ? { openingHoursSpecification: openingHoursSpecification() } : {}),
    servesCuisine: r.cuisines,
    ...(r.priceRange.status === 'confirmed' ? { priceRange: r.priceRange.value } : {}),
    acceptsReservations: 'True',
    hasMenu: abs(pathFor(locale, 'menu')),
    sameAs: socialProfiles(),
    inLanguage: LOCALE_META[locale].hreflang,
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function hreflangLinks(key: PageKey) {
  const alts = alternatesFor(key).map((a) => ({ hreflang: a.hreflang, href: abs(a.path) }));
  const def = alternatesFor(key).find((a) => a.locale === restaurant.languages.default)!;
  return [...alts, { hreflang: 'x-default', href: abs(def.path) }];
}
