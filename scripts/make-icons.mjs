/** Genera iconos PNG (favicon, apple-touch, manifest) desde public/favicon.svg. Uso: node scripts/make-icons.mjs */
import sharp from 'sharp';
import fs from 'node:fs';

const svg = fs.readFileSync('public/favicon.svg');
const out = [
  ['public/favicon-32.png', 32],
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
];
for (const [file, size] of out) await sharp(svg, { density: 384 }).resize(size, size).png().toFile(file);
// maskable: logo al 80% dentro de la zona segura, sobre fondo sólido
const base = await sharp(svg, { density: 384 }).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#2c3a20' } })
  .composite([{ input: base, left: 51, top: 51 }])
  .png()
  .toFile('public/icon-maskable-512.png');
console.log('icons ok');
