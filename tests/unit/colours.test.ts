import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');

function tokens(start: string, source = css): Record<string, string> {
  const at = source.indexOf(start);
  const block = at < 0 ? '' : source.slice(at, source.indexOf('}', at));
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map((m) => [m[1], m[2].toLowerCase()]));
}

const screen = tokens(':root {');
const light = tokens('html:root {', readFileSync('src/styles/light.css', 'utf8'));
const print = tokens('@media print');

function channels(hex: string): number[] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast between two tokens of a theme, failing if either is missing. */
function contrast(theme: Record<string, string>, a: string, b: string): number {
  expect(theme[a], a).toMatch(/^#[0-9a-f]{6}$/);
  expect(theme[b], b).toMatch(/^#[0-9a-f]{6}$/);
  const [hi, lo] = [luminance(theme[a]), luminance(theme[b])].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('colour tokens', () => {
  it.each([screen, light])('have one accent colour, and every other colour stays grey', (palette) => {
    const chroma = (hex: string) => Math.max(...channels(hex)) - Math.min(...channels(hex));
    expect(Object.keys(palette).filter((name) => chroma(palette[name]) > 0.2)).toEqual(['accent']);
  });

  it.each([screen, light])('keep text readable on the page and on every panel', (palette) => {
    for (const ground of ['bg', 'bg-raised', 'surface', 'surface-2']) {
      expect(contrast(palette, 'text', ground), ground).toBeGreaterThanOrEqual(7);
      expect(contrast(palette, 'text-2', ground), ground).toBeGreaterThanOrEqual(7);
      expect(contrast(palette, 'muted', ground), ground).toBeGreaterThanOrEqual(4.5);
      expect(contrast(palette, 'accent', ground), ground).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keep the primary button label readable', () => {
    expect(contrast(screen, 'bg', 'text')).toBeGreaterThanOrEqual(7);
  });

  it('print dark text on white paper', () => {
    expect(print.bg).toBe('#ffffff');
    expect(contrast(print, 'text', 'bg')).toBeGreaterThanOrEqual(7);
    expect(contrast(print, 'text-2', 'bg')).toBeGreaterThanOrEqual(7);
    expect(contrast(print, 'muted', 'bg')).toBeGreaterThanOrEqual(4.5);
    expect(contrast(print, 'accent', 'bg')).toBeGreaterThanOrEqual(4.5);
  });
});
