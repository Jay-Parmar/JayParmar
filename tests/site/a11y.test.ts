import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const assets = join('dist', '_astro');
const css = readdirSync(assets)
  .filter((name) => name.endsWith('.css'))
  .map((name) => readFileSync(join(assets, name), 'utf8'))
  .join('\n');
const layer = (rule: RegExp) => Number(css.match(rule)?.[1].match(/z-index:(\d+)/)?.[1]);

describe('accessibility', () => {
  it('shows the skip link above the sticky header', () => {
    const skip = layer(/\.skip\{([^}]*)\}/);
    const header = layer(/\{([^}]*position:sticky[^}]*)\}/);
    expect(header).toBeGreaterThan(0);
    expect(skip).toBeGreaterThan(header);
  });
});
