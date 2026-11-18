import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const assets = join('dist', '_astro');
const css = readdirSync(assets)
  .filter((name) => name.endsWith('.css'))
  .map((name) => readFileSync(join(assets, name), 'utf8'))
  .join('\n');
const layer = (body = '') => Number(body.match(/z-index:(\d+)/)?.[1] ?? 0);

describe('accessibility', () => {
  it('shows the skip link above everything sticky', () => {
    const skip = layer(css.match(/\.skip\{([^}]*)\}/)?.[1]);
    const sticky = [...css.matchAll(/\{([^}]*position:sticky[^}]*)\}/g)].map((rule) => layer(rule[1]));
    expect(Math.max(...sticky)).toBeGreaterThan(0);
    expect(skip).toBeGreaterThan(Math.max(...sticky));
  });
});
