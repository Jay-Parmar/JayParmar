import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = 'dist';
const base = '/JayParmar';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const all = files(dist);
const pages = all.filter((path) => path.endsWith('.html'));
const read = (path: string) => readFileSync(path, 'utf8');

function urlsIn(text: string): string[] {
  const attrs = [...text.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  const css = [...text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]);
  return [...attrs, ...css];
}

function resolves(url: string): boolean {
  const path = decodeURI(url.split(/[?#]/)[0].slice(base.length));
  const target = join(dist, path);
  if (path === '' || path.endsWith('/')) return existsSync(join(target, 'index.html'));
  return existsSync(target) || existsSync(join(target, 'index.html'));
}

describe('built site', () => {
  it('has pages', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  for (const page of pages) {
    describe(page, () => {
      const html = read(page);

      it('declares English', () => {
        expect(html).toMatch(/<html lang="en"/);
      });

      it('has a title and a description', () => {
        expect(html).toMatch(/<title>[^<]+<\/title>/);
        expect(html).toMatch(/<meta name="description" content="[^"]+"/);
      });

      it('only links to ids that exist on the page', () => {
        const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
        const links = [...html.matchAll(/\shref="#([^"]*)"/g)].map((m) => m[1]);
        expect(links.filter((id) => !ids.has(id))).toEqual([]);
      });
    });
  }

  it('keeps root-relative links and assets under the base path, and they exist', () => {
    const broken = all
      .filter((path) => ['.html', '.css'].includes(extname(path)))
      .flatMap((path) => urlsIn(read(path)).map((url) => ({ path, url })))
      .filter(({ url }) => url.startsWith('/') && !url.startsWith('//'))
      .filter(({ url }) => !url.startsWith(`${base}/`) || !resolves(url));
    expect(broken).toEqual([]);
  });

  it('has no dashes in any built file', () => {
    const texts = all.filter((path) => ['.html', '.css', '.js', '.svg'].includes(extname(path)));
    expect(texts.filter((path) => /[\u2013\u2014]/.test(read(path)))).toEqual([]);
  });

  it('shows no phone numbers', () => {
    const phone = /tel:|(?:\+?91[\s-]?)?\b[6-9]\d{4}[\s-]?\d{5}\b/;
    expect(pages.filter((path) => phone.test(read(path)))).toEqual([]);
  });
});
