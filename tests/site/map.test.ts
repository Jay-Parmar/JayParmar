import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync('dist/index.html', 'utf8');

describe('hero map', () => {
  it('keeps each train out of sight until it starts moving', () => {
    const trains = [...html.matchAll(/<rect class="train"[^>]*>([\s\S]*?)<\/rect>/g)];
    expect(trains).toHaveLength(5);
    for (const [rect, inner] of trains) {
      expect(rect).toContain('visibility="hidden"');
      const begin = inner.match(/<animateMotion[^>]*begin="([^"]+)"/)![1];
      expect(inner).toMatch(new RegExp(`<set attributeName="visibility" to="visible" begin="${begin}"`));
    }
  });

  it('draws a focus ring for every station', () => {
    const stations = html.match(/<a class="station"/g)?.length ?? 0;
    expect(stations).toBe(6);
    expect(html.match(/<g class="focus"/g)?.length).toBe(stations);
  });
});
