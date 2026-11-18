import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const html = readFileSync('dist/index.html', 'utf8');
const site = 'https://jay-parmar.github.io/JayParmar/';
const meta = (name: string) => html.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]+)"`))?.[1];

describe('sharing', () => {
  it('gives links a large preview image that is published with the site', () => {
    const image = meta('og:image') ?? '';
    expect(image.startsWith(site)).toBe(true);
    expect(existsSync(join('dist', image.slice(site.length)))).toBe(true);
    expect(meta('og:image:width')).toBe('1200');
    expect(meta('og:image:height')).toBe('630');
    expect(meta('og:image:alt')).toBeTruthy();
    expect(meta('twitter:card')).toBe('summary_large_image');
  });

  it('has an icon for phone home screens', () => {
    expect(html).toContain('<link rel="apple-touch-icon" href="/JayParmar/apple-touch-icon.png"');
  });
});
