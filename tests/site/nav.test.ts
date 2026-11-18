import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const header = (path: string) => {
  const html = readFileSync(path, 'utf8');
  return html.slice(html.indexOf('<header class="nav"'), html.indexOf('</header>'));
};

describe('site nav', () => {
  it('folds the sections into a menu on phones without needing a script', () => {
    const nav = header('dist/index.html');
    expect(nav).toMatch(/<button[^>]*popovertarget="sections"/);
    expect(nav).toMatch(/<ul[^>]*id="sections"[^>]*popover/);
  });

  it('leads from other pages back to each section of the home page', () => {
    for (const path of ['dist/projects/hirejutsu/index.html', 'dist/404.html']) {
      const targets = [...header(path).matchAll(/href="\/JayParmar\/#(\w+)"/g)].map((m) => m[1]);
      expect(targets, path).toEqual(['results', 'experience', 'projects', 'skills', 'contact']);
    }
  });

  it('marks Projects as the current section on project pages', () => {
    const nav = header('dist/projects/hirejutsu/index.html');
    expect(nav.match(/<a[^>]*aria-current="true"[^>]*>([^<]+)</)?.[1]?.trim()).toBe('Projects');
  });

  it('blurs the page behind it in every browser, not only Safari', () => {
    const css = readdirSync('dist/_astro')
      .filter((name) => name.endsWith('.css'))
      .map((name) => readFileSync(join('dist/_astro', name), 'utf8'))
      .join('\n');
    expect(css).toMatch(/[{;]backdrop-filter:saturate\(160%\) ?blur\(14px\)/);
  });
});
