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
    expect(nums(card('hold-my-files'))).toEqual(['146']);
    expect(nums(card('foodhub-sniffer'))).toEqual(['36']);
    expect(nums(card('ens-meeting-bridge'))).toEqual([]);
  });

  it('pull out the number that leads each fact on their own pages', () => {
    expect(nums(page('hirejutsu'))).toEqual(['629', '15', '2,000+']);
    expect(nums(page('hold-my-files'))).toEqual(['146']);
    expect(nums(page('foodhub-sniffer'))).toEqual(['36']);
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

  it('lead back to the list from the top of their pages', () => {
    for (const project of projects.filter((project) => project.page)) {
      expect(page(project.slug).match(/<a [^>]*href="([^"]+)"/)?.[1], project.slug).toBe('/JayParmar/#projects');
    }
  });

  it('lead on to the next project page, wrapping round at the end', () => {
    const slugs = projects.filter((project) => project.page).map((project) => project.slug);
    slugs.forEach((slug, i) => {
      const next = slugs[(i + 1) % slugs.length];
      expect(page(slug), slug).toMatch(new RegExp(`<a class="next[^"]*"[^>]*href="/JayParmar/projects/${next}/"`));
    });
  });

  it('list the projects with no page or public code together under Also built', () => {
    const also = html.slice(html.indexOf('id="also-title"'), html.indexOf('id="skills"'));
    for (const project of projects) {
      expect(also.includes(`id="project-${project.slug}"`), project.slug).toBe(!project.page && !project.code);
    }
  });

  it('keep the words you see in the name of each link', () => {
    for (const { text, name } of repeated) expect(name.toLowerCase()).toContain(text.toLowerCase());
  });
});
