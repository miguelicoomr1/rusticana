import { describe, it, expect } from 'vitest';

/** Contraste WCAG de las parejas de color realmente usadas (tokens de src/styles/global.css). */
const c = {
  straw: '#f4eedd',
  strawDeep: '#ebe2c8',
  ink: '#26281b',
  stone: '#5b5546',
  olive800: '#2c3a20',
  olive900: '#232d18',
  olive700: '#3c4d2a',
  olive600: '#4d6035',
  esparto: '#d5c28f',
  onOlive: '#f4eedd',
  onOliveMuted: '#d3cfb2',
  terracotta: '#a54725',
  terracottaDeep: '#8a3a1c',
  btnText: '#fff9ee',
  field: '#fffdf6',
};

function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
const ratio = (a: string, b: string) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const pairs: [string, string, string, number][] = [
  ['texto sobre paja', c.ink, c.straw, 4.5],
  ['texto sobre paja oscura', c.ink, c.strawDeep, 4.5],
  ['texto secundario sobre paja', c.stone, c.straw, 4.5],
  ['texto secundario sobre paja oscura', c.stone, c.strawDeep, 4.5],
  ['texto sobre olivo', c.onOlive, c.olive800, 4.5],
  ['texto atenuado sobre olivo', c.onOliveMuted, c.olive800, 4.5],
  ['texto atenuado sobre olivo profundo (consent)', c.onOliveMuted, c.olive900, 4.5],
  ['esparto (títulos de pie / iconos) sobre olivo', c.esparto, c.olive800, 4.5],
  ['botón terracota', c.btnText, c.terracotta, 4.5],
  ['botón terracota hover', c.btnText, c.terracottaDeep, 4.5],
  ['precio terracota sobre paja', c.terracottaDeep, c.straw, 4.5],
  ['etiqueta de categoría olivo sobre paja', c.olive600, c.straw, 4.5],
  ['cifra grande olivo sobre paja', c.olive700, c.straw, 3],
  ['error terracota sobre campo', c.terracottaDeep, c.field, 4.5],
  ['etiqueta activa (paja sobre olivo)', c.straw, c.olive800, 4.5],
];

describe('contraste WCAG AA', () => {
  for (const [name, fg, bg, min] of pairs) it(`${name} ≥ ${min}:1`, () => expect(ratio(fg, bg)).toBeGreaterThanOrEqual(min));
});
