/** Genera public/og-image.png (1200x630) a partir de una fotografía real + panel de marca. Uso: node scripts/make-og.mjs */
import sharp from 'sharp';

const W = 1200;
const H = 630;
const photo = await sharp('src/assets/photos/terrace-day.jpg').resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();

const panel = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="0" y="${H - 250}" width="760" height="250" fill="#2c3a20"/>
  <defs>
    <pattern id="p" width="28" height="22" patternUnits="userSpaceOnUse">
      <rect width="28" height="22" fill="#d5c28f"/>
      <path d="M0 0 14 11 28 0 M0 11 14 22 28 11" fill="none" stroke="#b39a5b" stroke-width="2.4"/>
    </pattern>
  </defs>
  <rect x="0" y="${H - 250}" width="760" height="14" fill="url(#p)"/>
  <text x="56" y="${H - 128}" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-weight="700" fill="#f4eedd">La Rusticana</text>
  <text x="58" y="${H - 78}" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#f4eedd">Restaurante · Atamaría · La Manga Club</text>
  <text x="58" y="${H - 36}" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#d3cfb2">Desde 1986 · Cartagena, Murcia</text>
</svg>`;

await sharp(photo)
  .composite([{ input: Buffer.from(panel), left: 0, top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png');
console.log('og ok');
