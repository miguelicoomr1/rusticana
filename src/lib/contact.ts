import { restaurant } from '../config/restaurant.config.ts';
import { t, type Locale } from '../i18n/index.ts';

export const telHref = `tel:${restaurant.phone.e164}`;
export const mailHref = `mailto:${restaurant.email.address}`;

/** Enlace wa.me con mensaje predefinido en el idioma activo (o texto personalizado). */
export function whatsappHref(locale: Locale, text?: string): string {
  const msg = text ?? t(locale, 'whatsapp.defaultMessage');
  return `https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(msg)}`;
}

/** NAP: una sola representación de la dirección para toda la web. */
export function addressLines() {
  const a = restaurant.address;
  return {
    name: restaurant.displayName,
    street: a.streetAddress,
    postal: `${a.postalCode} ${a.addressLocality}`,
    region: a.addressRegion,
    country: 'España',
    oneLine: `${a.streetAddress}, ${a.postalCode} ${a.addressLocality}, ${a.addressRegion}`,
  };
}
