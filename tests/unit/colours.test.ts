import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');
const lineIds = ['backend', 'data', 'cloud', 'ml', 'frontend'];

function tokens(block: string): Record<string, string> {
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map((m) => [m[1], m[2]]));
}

const light = tokens(css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {'))));
const darkStart = css.indexOf('@media (prefers-color-scheme: dark)');
const dark = { ...light, ...tokens(darkStart < 0 ? '' : css.slice(darkStart, css.indexOf('}', darkStart))) };
const printStart = css.indexOf('@media print');
const print = tokens(printStart < 0 ? '' : css.slice(printStart, css.indexOf('}', printStart)));
const nightStart = css.indexOf('.night {');
const night = tokens(nightStart < 0 ? '' : css.slice(nightStart, css.indexOf('}', nightStart)));

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('colour tokens', () => {
  it('have a night palette', () => {
    expect(darkStart).toBeGreaterThan(-1);
    expect(dark.paper).not.toBe(light.paper);
  });

  for (const [name, theme] of Object.entries({ light, dark })) {
    it(`keep text readable in the ${name} theme`, () => {
      expect(contrast(theme.ink, theme.paper)).toBeGreaterThanOrEqual(7);
      expect(contrast(theme.muted, theme.paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme['band-ink'], theme.band)).toBeGreaterThanOrEqual(7);
      expect(contrast(theme['band-muted'], theme.band)).toBeGreaterThanOrEqual(4.5);
    });

    it(`keep every line bright on the dark band in the ${name} theme`, () => {
      for (const id of lineIds) expect(contrast(night[id] ?? '#000000', theme.band), id).toBeGreaterThanOrEqual(3);
    });

    it(`keep every line visible and its badge readable in the ${name} theme`, () => {
      for (const id of lineIds) {
        expect(contrast(theme[id], theme.paper), id).toBeGreaterThanOrEqual(4.5);
        expect(contrast(theme['on-line'], theme[id]), id).toBeGreaterThanOrEqual(4.5);
      }
    });
  }

  it('print dark text on white paper in either theme', () => {
    expect(print.paper).toBe('#ffffff');
    expect(print.band).toBe('#ffffff');
    expect(contrast(print.ink ?? '#ffffff', print.paper)).toBeGreaterThanOrEqual(7);
    expect(contrast(print['band-ink'] ?? '#ffffff', print.band)).toBeGreaterThanOrEqual(7);
    for (const id of lineIds) expect(contrast(print[id] ?? '#ffffff', print.paper), id).toBeGreaterThanOrEqual(4.5);
  });
});
