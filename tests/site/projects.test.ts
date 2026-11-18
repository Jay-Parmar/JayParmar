import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects';

const html = readFileSync('dist/index.html', 'utf8');
const between = (from: string, to: string) => html.slice(html.indexOf(from), html.indexOf(to));
const card = (slug: string) => {
  const start = html.indexOf(`id="project-${slug}"`);
  return html.slice(start, html.indexOf('</article>', start));
};
const page = (slug: string) => {
  const text = readFileSync(`dist/projects/${slug}/index.html`, 'utf8');
  return text.slice(text.indexOf('<main'), text.indexOf('</main>'));
};
const chips = (text: string) => [...text.matchAll(/class="chip"[^>]*>([^<]+)</g)].map((m) => m[1].trim());

describe('projects', () => {
  it('mark the lines of every project', () => {
    const section = between('id="projects"', 'id="skills"');
    expect(section.match(/<span class="badge"/g)?.length).toBe(projects.flatMap((project) => project.lines).length);
  });

  it('list their whole stack as chips', () => {
    for (const project of projects) expect(chips(card(project.slug)), project.slug).toEqual(project.stack);
  });

  it('list their whole stack as chips on their own pages', () => {
    for (const project of projects.filter((project) => project.page)) {
      expect(chips(page(project.slug)), project.slug).toEqual(project.stack);
    }
  });
});
