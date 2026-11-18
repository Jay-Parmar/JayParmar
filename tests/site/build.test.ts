import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { roles } from '../../src/data/experience';
import { areas } from '../../src/data/skills';
import { profile } from '../../src/data/profile';
import { projects } from '../../src/data/projects';
import { results } from '../../src/data/results';

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

describe('home page', () => {
  const html = read(join(dist, 'index.html'));
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  it('has every section', () => {
    for (const id of ['top', 'results', 'experience', 'education', 'projects', 'skills', 'contact']) {
      expect(html).toContain(`id="${id}"`);
    }
  });

  it('shows every role, project, result and skill area', () => {
    for (const role of roles) {
      expect(html).toContain(`id="${role.id}"`);
      expect(text).toContain(role.title);
    }
    for (const project of projects) {
      expect(html).toContain(`id="project-${project.slug}"`);
      expect(text).toContain(project.name);
    }
    for (const result of results) expect(text).toContain(result.label);
    for (const area of areas) expect(text).toContain(area.name);
  });

  it('turns ** marks into bold text', () => {
    expect(html.replace(/<script[\s\S]*?<\/script>/g, '')).not.toContain('**');
    expect(html).toMatch(/<strong[^>]*>240\+ cameras<\/strong>/);
  });

  it('gives three ways to get in touch', () => {
    expect(html).toContain(`href="mailto:${profile.email}"`);
    expect(html).toContain(`href="${profile.linkedin}"`);
    expect(html).toContain(`href="${profile.github}"`);
  });
});

describe('section nav', () => {
  const html = read(join(dist, 'index.html'));

  it('links every section in page order', () => {
    const nav = html.match(/<nav[^>]*aria-label="Sections"[^>]*>([\s\S]*?)<\/nav>/);
    expect(nav).not.toBeNull();
    const targets = [...nav![1].matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    expect(targets).toEqual(['results', 'experience', 'projects', 'skills', 'contact']);
  });
});

describe('project pages', () => {
  const withPages = projects.filter((project) => project.page);

  it('exist for every project with public code', () => {
    expect(withPages.map((project) => project.slug)).toEqual(['hirejutsu', 'hold-my-files', 'foodhub-sniffer']);
    for (const project of withPages) {
      expect(existsSync(join(dist, 'projects', project.slug, 'index.html'))).toBe(true);
    }
  });

  it('link back to the projects and out to the code', () => {
    for (const project of withPages) {
      const html = read(join(dist, 'projects', project.slug, 'index.html'));
      expect(html).toContain(`href="${base}/#projects"`);
      expect(html).toContain(`href="${project.code}"`);
      expect(html).toContain(project.page!.how[0].split("'")[0]);
    }
  });

  it('are linked from the home page', () => {
    const home = read(join(dist, 'index.html'));
    for (const project of withPages) expect(home).toContain(`href="${base}/projects/${project.slug}/"`);
  });
});
