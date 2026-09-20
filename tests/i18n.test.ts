import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { dictionaries, LOCALES } from '../src/i18n/index.ts';
import { PAGE_KEYS, SLUGS, pathFor, resolvePath } from '../src/i18n/routes.ts';

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function flatten(value: Json, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (typeof value === 'string') out.set(prefix, value);
  else if (Array.isArray(value)) value.forEach((v, i) => flatten(v, `${prefix}[${i}]`).forEach((s, k) => out.set(k, s)));
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k).forEach((s, kk) => out.set(kk, s));
  return out;
}

const es = flatten(dictionaries.es as Json);
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

describe('locales', () => {
  for (const locale of LOCALES.filter((l) => l !== 'es')) {
    const dict = flatten(dictionaries[locale] as Json);
    it(`${locale}: same keys as es`, () => {
      const missing = [...es.keys()].filter((k) => !dict.has(k));
      const extra = [...dict.keys()].filter((k) => !es.has(k));
      expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });
    it(`${locale}: placeholders preserved`, () => {
      for (const [k, v] of es) expect(placeholders(dict.get(k) ?? ''), k).toBe(placeholders(v));
    });
    it(`${locale}: really translated (not a copy of es)`, () => {
      const copies = [...es].filter(([k, v]) => v.length > 25 && dict.get(k) === v && !k.startsWith('legal')).map(([k]) => k);
      expect(copies.length, copies.slice(0, 5).join(', ')).toBeLessThan(6);
    });
    it(`${locale}: no empty strings`, () => {
      expect([...dict].filter(([, v]) => !v.trim()).map(([k]) => k)).toEqual([]);
    });
    it(`${locale}: SEO lengths`, () => {
      for (const [k, v] of dict) {
        if (/^seo\.[a-zA-Z]+\.title$/.test(k)) expect(v.length, k).toBeLessThanOrEqual(65);
        if (/^seo\.[a-zA-Z]+\.description$/.test(k)) expect(v.length, k).toBeLessThanOrEqual(165);
      }
    });
  }

  it('every t()/tx() key used in source exists in es', () => {
    const root = path.resolve('src');
    const files: string[] = [];
    const walk = (d: string) =>
      fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(astro|ts)$/.test(e.name)) files.push(p);
      });
    walk(root);
    const missing: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, 'utf8');
      for (const m of src.matchAll(/\bt[x]?\(\s*[\w.]+\s*,\s*'([\w.]+)'/g)) {
        if (!es.has(m[1]) && ![...es.keys()].some((k) => k.startsWith(`${m[1]}.`) || k.startsWith(`${m[1]}[`))) missing.push(`${path.basename(f)}: ${m[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe('routes', () => {
  it('slugs are unique per locale', () => {
    for (const l of LOCALES) {
      const slugs = PAGE_KEYS.map((k) => SLUGS[k][l]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
  it('pathFor / resolvePath round-trip', () => {
    for (const l of LOCALES) for (const k of PAGE_KEYS) expect(resolvePath(pathFor(l, k))).toEqual({ locale: l, key: k });
  });
  it('paths are clean (lowercase, ascii, trailing slash)', () => {
    for (const l of LOCALES) for (const k of PAGE_KEYS) expect(pathFor(l, k)).toMatch(/^\/[a-z]{2}\/([a-z-]+\/)?$/);
  });
});
