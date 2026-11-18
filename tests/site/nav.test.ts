import { readFileSync } from 'node:fs';
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
});
