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
  it('have one accent colour, and every other colour stays grey', () => {
    const chroma = (hex: string) => Math.max(...channels(hex)) - Math.min(...channels(hex));
    expect(Object.keys(screen).filter((name) => chroma(screen[name]) > 0.2)).toEqual(['accent']);
  });

  it('keep text readable on the page and on every panel', () => {
    for (const ground of ['bg', 'bg-raised', 'surface', 'surface-2']) {
      expect(contrast(screen, 'text', ground), ground).toBeGreaterThanOrEqual(7);
      expect(contrast(screen, 'text-2', ground), ground).toBeGreaterThanOrEqual(7);
      expect(contrast(screen, 'muted', ground), ground).toBeGreaterThanOrEqual(4.5);
      expect(contrast(screen, 'accent', ground), ground).toBeGreaterThanOrEqual(4.5);
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
