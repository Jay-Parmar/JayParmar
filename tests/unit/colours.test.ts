import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');

function tokens(start: string): Record<string, string> {
  const at = css.indexOf(start);
  const block = at < 0 ? '' : css.slice(at, css.indexOf('}', at));
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map((m) => [m[1], m[2].toLowerCase()]));
}

const screen = tokens(':root {');
const print = tokens('@media print');

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a = '#000000', b = '#000000'): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('colour tokens', () => {
  it('use one accent colour, not a colour per skill', () => {
    for (const id of ['backend', 'data', 'cloud', 'ml', 'frontend']) expect(screen[id], id).toBeUndefined();
    expect(screen.accent).toMatch(/^#/);
  });

  it('keep text readable on the page and on every panel', () => {
    for (const ground of ['bg', 'bg-raised', 'surface', 'surface-2']) {
      expect(contrast(screen.text, screen[ground]), ground).toBeGreaterThanOrEqual(7);
      expect(contrast(screen['text-2'], screen[ground]), ground).toBeGreaterThanOrEqual(7);
      expect(contrast(screen.muted, screen[ground]), ground).toBeGreaterThanOrEqual(4.5);
      expect(contrast(screen.accent, screen[ground]), ground).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keep button labels readable', () => {
    expect(contrast(screen.bg, screen.text)).toBeGreaterThanOrEqual(7);
    expect(contrast(screen['on-accent'], screen.accent)).toBeGreaterThanOrEqual(4.5);
  });

  it('print dark text on white paper', () => {
    expect(print.bg).toBe('#ffffff');
    expect(contrast(print.text, print.bg)).toBeGreaterThanOrEqual(7);
    expect(contrast(print['text-2'], print.bg)).toBeGreaterThanOrEqual(7);
    expect(contrast(print.muted, print.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(print.accent, print.bg)).toBeGreaterThanOrEqual(4.5);
  });
});
