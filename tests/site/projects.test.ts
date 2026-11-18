import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects';

const html = readFileSync('dist/index.html', 'utf8');
const card = (slug: string) => {
  const start = html.indexOf(`id="project-${slug}"`);
  return html.slice(start, html.indexOf('</article>', start));
};
const page = (slug: string) => {
  const text = readFileSync(`dist/projects/${slug}/index.html`, 'utf8');
  return text.slice(text.indexOf('<main'), text.indexOf('</main>'));
};
const chips = (text: string) => [...text.matchAll(/class="chip"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
const nums = (text: string) => [...text.matchAll(/class="num"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
const repeated = projects
  .flatMap((project) =>
    [...card(project.slug).matchAll(/<a\b([^>]*)>([^<]+)<\/a>/g)].map(([, attrs, text]) => ({
      project: project.name,
      text: text.trim(),
      name: attrs.match(/aria-label="([^"]+)"/)?.[1] ?? text.trim(),
    })),
  )
  .filter(({ text }) => ['How it works', 'Code on GitHub'].includes(text));

describe('projects', () => {
  it('list their whole stack as chips', () => {
    for (const project of projects) expect(chips(card(project.slug)), project.slug).toEqual(project.stack);
  });

  it('list their whole stack as chips on their own pages', () => {
    for (const project of projects.filter((project) => project.page)) {
      expect(chips(page(project.slug)), project.slug).toEqual(project.stack);
    }
  });

  it('pull out the number that leads each fact', () => {
    expect(nums(card('hirejutsu'))).toEqual(['629', '15', '2,000+']);
  });

  it('mark the projects with public code as open source', () => {
    const open = ['hirejutsu', 'hold-my-files', 'foodhub-sniffer'];
    const marked = projects.filter((project) => card(project.slug).includes('>Open source<'));
    expect(marked.map((project) => project.slug)).toEqual(open);
    for (const slug of open) expect(page(slug), slug).toContain('>Open source<');
  });

  it('give every How it works and Code on GitHub link a name of its own', () => {
    expect(repeated).toHaveLength(6);
    expect(new Set(repeated.map(({ name }) => name)).size).toBe(repeated.length);
    for (const { project, name } of repeated) expect(name).toContain(project);
  });

  it('keep the words you see in the name of each link', () => {
    for (const { text, name } of repeated) expect(name.toLowerCase()).toContain(text.toLowerCase());
  });
});
