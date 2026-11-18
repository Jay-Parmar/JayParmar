import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = existsSync('dist/404.html') ? readFileSync('dist/404.html', 'utf8') : '';
const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));

describe('404 page', () => {
  it('exists where GitHub Pages looks for it', () => {
    expect(existsSync('dist/404.html')).toBe(true);
  });

  it('leads back to the home page', () => {
    expect(html).toContain('href="/JayParmar/"');
    expect(html).toContain('<h1');
    expect(main).toMatch(/<a class="button primary" href="\/JayParmar\/"[^>]*>Back to the home page<\/a>/);
  });

  it('says the page was not found, without map wording', () => {
    expect(main).toMatch(/<h1[^>]*>Page not found<\/h1>/);
    expect(main).not.toMatch(/map|station/i);
  });
});
