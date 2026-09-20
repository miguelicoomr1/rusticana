/**
 * Galería. Cada elemento con `photo` usa una fotografía real (src/data/photos.ts).
 * Cada elemento sin `photo` es una casilla PENDIENTE: `brief` describe exactamente la foto que debe aportar el restaurante.
 */
import type { PhotoKey } from './photos.ts';

export type GalleryCategory = 'restaurant' | 'terrace' | 'food' | 'interior' | 'events' | 'family' | 'surroundings';

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  photo?: PhotoKey;
  /** Forma de la casilla en el mosaico */
  shape: 'wide' | 'tall' | 'square';
  /** Solo casillas pendientes: descripción en español de la foto que debe aportar el restaurante */
  brief?: string;
}

export const galleryItems: GalleryItem[] = [
  { id: 'terrace-day', category: 'terrace', photo: 'terraceDay', shape: 'wide' },
  { id: 'dish-salad', category: 'food', photo: 'dishSalad', shape: 'tall' },
  { id: 'dining-room', category: 'interior', photo: 'diningRoom', shape: 'wide' },
  { id: 'terrace-evening', category: 'terrace', photo: 'terraceEvening', shape: 'wide' },
  { id: 'dish-paella', category: 'food', photo: 'dishPaella', shape: 'square' },
  { id: 'playground', category: 'family', photo: 'playground', shape: 'wide' },
  { id: 'dish-squid', category: 'food', photo: 'dishSquid', shape: 'square' },
  { id: 'dish-scallops', category: 'food', photo: 'dishScallops', shape: 'wide' },
  { id: 'facade', category: 'restaurant', shape: 'wide', brief: 'Fachada y entrada del restaurante a la luz del día, con el cartel visible.' },
  { id: 'fireplace', category: 'interior', shape: 'tall', brief: 'Salón con la chimenea encendida en invierno.' },
  { id: 'live-music', category: 'events', shape: 'wide', brief: 'Actuación de música en directo con público en la terraza.' },
  { id: 'celebration', category: 'events', shape: 'square', brief: 'Mesa larga preparada para una celebración o cena de grupo.' },
  { id: 'indoor-play', category: 'family', shape: 'square', brief: 'Zona de juegos interior para los días de lluvia.' },
  { id: 'sierra', category: 'surroundings', shape: 'wide', brief: 'Vista de la sierra de Atamaría y la vegetación mediterránea alrededor del restaurante.' },
  { id: 'team', category: 'restaurant', shape: 'wide', brief: 'Nicole y el equipo en sala, con el comedor de fondo.' },
];
