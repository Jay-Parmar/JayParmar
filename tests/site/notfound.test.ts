import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('404 page', () => {
  it('exists where GitHub Pages looks for it', () => {
    expect(existsSync('dist/404.html')).toBe(true);
  });

  it('leads back to the map', () => {
    const html = existsSync('dist/404.html') ? readFileSync('dist/404.html', 'utf8') : '';
    expect(html).toContain('href="/JayParmar/"');
    expect(html).toContain('<h1');
  });
});
