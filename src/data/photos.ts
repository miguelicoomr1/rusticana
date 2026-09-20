/**
 * Registro de fotografías reales. Origen: web oficial del restaurante (Webnode) — ver docs/IMAGENES.md.
 * Para añadir fotos nuevas: copiarlas a src/assets/photos/, importarlas aquí y referenciarlas
 * desde gallery.ts. El texto alternativo vive en src/locales/*.json (photos.<clave>).
 */
import terraceEvening from '../assets/photos/terrace-evening.jpg';
import terraceDay from '../assets/photos/terrace-day.jpg';
import diningRoom from '../assets/photos/dining-room.jpg';
import playground from '../assets/photos/playground.jpg';
import dishSquid from '../assets/photos/dish-squid.jpg';
import dishPaella from '../assets/photos/dish-paella.jpg';
import dishSalad from '../assets/photos/dish-tropical-salad.jpg';
import dishScallops from '../assets/photos/dish-scallops.jpg';

export const photos = {
  terraceEvening,
  terraceDay,
  diningRoom,
  playground,
  dishSquid,
  dishPaella,
  dishSalad,
  dishScallops,
} as const;

export type PhotoKey = keyof typeof photos;
