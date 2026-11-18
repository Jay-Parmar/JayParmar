import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync('dist/index.html', 'utf8');
const delays = (pattern: RegExp) => Object.fromEntries([...html.matchAll(pattern)].map((m) => [m[1], m[2]]));

describe('hero', () => {
  it('lights each band segment as its line sets off on the map', () => {
    const band = delays(/<span class="segment" style="--c: var\(--(\w+)\); --delay: ([\d.]+s)"/g);
    const map = delays(/id="line-(\w+)"[^>]*style="--c: var\(--\w+\); --delay: ([\d.]+s)/g);
    expect(Object.keys(band)).toHaveLength(5);
    expect(band).toEqual(map);
  });
});
