/**
 * ÚNICA fuente de verdad de los datos del restaurante.
 * Ningún componente debe repetir teléfono, dirección, horarios, etc.
 *
 * Convención de fiabilidad (`status`):
 *   'confirmed'  → contrastado en varias fuentes fiables.
 *   'disputed'   → fuentes en conflicto; revisar con el propietario.
 *   'pending'    → sin verificar / sin dato; NO se publica en el sitio.
 * Ver docs/DATOS.md para la tabla completa DATO | VALOR | FUENTE | FECHA | CONFIANZA.
 */
import type { Locale } from '../i18n/locales.ts';

type Status = 'confirmed' | 'disputed' | 'pending';

const env = import.meta.env ?? {};

export interface OpeningSlot {
  /** 0 = domingo … 6 = sábado (igual que schema.org / Date.getDay()) */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** "HH:MM" 24 h. Una entrada por tramo (puede haber varias por día). */
  opens: string;
  /** "HH:MM"; "24:00" = medianoche. */
  closes: string;
}

export const restaurant = {
  name: 'La Rusticana',
  /** Nombre comercial completo (NAP): debe coincidir en toda la web. */
  displayName: 'Restaurante La Rusticana',
  tagline: {
    es: 'Cocina mediterránea e internacional, desde 1986',
    en: 'Mediterranean and international cuisine, since 1986',
    de: 'Mediterrane und internationale Küche, seit 1986',
    fr: 'Cuisine méditerranéenne et internationale, depuis 1986',
    nl: 'Mediterrane en internationale keuken, sinds 1986',
  } satisfies Record<Locale, string>,
  foundedYear: 1986,

  /** Titular legal. Se publica en Aviso Legal SOLO si status === 'confirmed'. */
  legal: {
    status: 'pending' as Status,
    legalName: null as string | null,
    vatId: null as string | null,
    registeredAddress: null as string | null,
    note: 'Sin verificar. Un directorio vincula TAMARINDOS ATAMARIA S.L. (B30763361) al área, pero su domicilio dice "REST LA FINCA" (otro restaurante) y ningún registro la une a "La Rusticana". El propietario debe facilitar razón social y NIF. Ver docs/DATOS.md.',
  },

  phone: { display: '+34 626 91 90 20', e164: '+34626919020', status: 'confirmed' as Status },
  whatsapp: {
    /** Sin +, formato wa.me. Se asume el mismo número móvil; el propietario debe confirmar que WhatsApp está activo. */
    number: '34626919020',
    status: 'pending' as Status,
  },
  email: { address: 'larusticanarestaurant@outlook.es', status: 'confirmed' as Status },

  address: {
    streetAddress: 'Paraje Atamaría, 76',
    postalCode: '30385',
    /** Localidad postal / municipio */
    addressLocality: 'Cartagena',
    /** Entorno geográfico natural para copy (sin spam) */
    areas: ['Atamaría', 'Los Belones', 'La Manga Club', 'Cartagena', 'Costa Cálida', 'Región de Murcia'],
    addressRegion: 'Región de Murcia',
    addressCountry: 'ES',
  },
  geo: { latitude: 37.6054947, longitude: -0.8093213, status: 'confirmed' as Status },

  maps: {
    /** Enlace corto suministrado por el propietario (ficha de Google Maps). */
    shortUrl: 'https://maps.app.goo.gl/cLdziiLQG7F2kswF7',
    /** Ficha por CID (equivale al ftid 0xd633d12ce421f65:0xd16ddc797a6b3f51). */
    placeUrl: 'https://maps.google.com/?cid=15090960340691402577',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=37.6054947,-0.8093213',
    embedUrl: env.PUBLIC_MAPS_EMBED_URL || 'https://maps.google.com/maps?q=37.6054947,-0.8093213&z=16&output=embed',
  },

  /**
   * HORARIOS — DISPUTADOS. Ver docs/DATOS.md.
   * Editar aquí (y solo aquí) cuando el propietario confirme. `status: 'confirmed'` retira el aviso "confirme por teléfono".
   * Mientras `status !== 'confirmed'`, el JSON-LD publica los tramos de `schedule` igualmente (mejor estimación reciente), pero la web avisa al visitante.
   */
  hours: {
    status: 'disputed' as Status,
    lastCheckedISO: '2026-09-20',
    /** Mejor estimación actual: Google Maps + agregadores recientes (mié–dom tarde/noche; lun–mar cerrado). */
    schedule: [
      { day: 3, opens: '18:30', closes: '24:00' },
      { day: 4, opens: '18:30', closes: '24:00' },
      { day: 5, opens: '18:30', closes: '24:00' },
      { day: 6, opens: '18:30', closes: '24:00' },
      { day: 0, opens: '18:30', closes: '23:30' },
    ] as OpeningSlot[],
    closedDays: [1, 2] as number[],
  },

  reservation: {
    /** Si está vacío, el formulario envía la solicitud por WhatsApp o correo. */
    endpoint: env.PUBLIC_RESERVATION_ENDPOINT || '',
    maxOnlineGuests: 12,
    /** Franjas ofrecidas en el formulario (editable). No implica disponibilidad: la reserva se confirma con el restaurante. */
    timeSlots: [
      '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
    ],
    areas: ['terrace', 'indoor', 'none'] as const,
  },

  social: {
    instagram: {
      url: 'https://www.instagram.com/restaurantelarusticanalamanga/',
      handle: '@restaurantelarusticanalamanga',
      status: 'confirmed' as Status,
    },
    facebook: {
      url: 'https://www.facebook.com/LaRusticanaLaManga/',
      status: 'confirmed' as Status,
    },
    tripadvisor: {
      url: 'https://www.tripadvisor.com/Restaurant_Review-g968389-d4216833-Reviews-La_Rusticana-Los_Belones_Municipality_of_Cartagena.html',
      status: 'confirmed' as Status,
    },
  },

  /** Valoraciones: solo texto informativo. NUNCA se genera AggregateRating artificial en JSON-LD. */
  reviews: {
    google: { rating: 4.6, count: 253, checked: '2026-09-20', status: 'confirmed' as Status },
    tripadvisor: { rating: 4.0, count: 91, checked: '2026-09-20', status: 'confirmed' as Status },
  },

  languages: {
    default: 'es' as Locale,
    /** Idiomas que habla el personal: pendiente de confirmar con el propietario (reseñas mencionan alemán). */
    staffSpokenStatus: 'pending' as Status,
  },

  priceRange: { value: '€€', status: 'disputed' as Status },
  cuisines: ['Mediterranean', 'European', 'Spanish', 'International'],

  analytics: {
    ga4Id: env.PUBLIC_GA4_ID || '',
    gscVerification: env.PUBLIC_GSC_VERIFICATION || '',
  },

  site: {
    url: (import.meta.env?.SITE as string | undefined) || 'https://larusticana.example',
    urlStatus: (env.PUBLIC_SITE_URL ? 'confirmed' : 'pending') as Status,
  },
} as const;

export type Restaurant = typeof restaurant;
export const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
export const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
