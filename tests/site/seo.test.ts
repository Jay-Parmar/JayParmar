import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { profile } from '../../src/data/profile';
import { projects } from '../../src/data/projects';

const html = readFileSync('dist/index.html', 'utf8');
const site = 'https://jay-parmar.github.io/JayParmar/';

function schemas(text: string): Record<string, unknown>[] {
  return [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    const data = JSON.parse(m[1]);
    return Array.isArray(data['@graph']) ? data['@graph'] : [data];
  });
}

describe('search', () => {
  it('titles the home page with the name and the roles recruiters search for', () => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    expect(title).toContain(profile.name);
    expect(title).toMatch(/full stack developer/i);
    expect(title.length).toBeLessThanOrEqual(65);
  });

  it('describes the home page in one search snippet with the core stack', () => {
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
    expect(description.length).toBeLessThanOrEqual(160);
    for (const word of ['React', 'Python', 'AWS']) expect(description).toContain(word);
  });

  it('describes Jay as a person search engines can read', () => {
    const person = schemas(html).find((item) => item['@type'] === 'Person') as Record<string, any> | undefined;
    expect(person).toBeDefined();
    expect(person!.name).toBe(profile.name);
    expect(person!.jobTitle).toBeTruthy();
    expect(person!.sameAs).toEqual(expect.arrayContaining([profile.linkedin, profile.github]));
    expect(person!.worksFor?.name).toBeTruthy();
    expect(person!.knowsAbout).toEqual(expect.arrayContaining(['React', 'Python', 'PostgreSQL']));
  });

  it('describes each project page as source code by Jay', () => {
    for (const project of projects.filter((project) => project.page)) {
      const page = readFileSync(`dist/projects/${project.slug}/index.html`, 'utf8');
      const code = schemas(page).find((item) => item['@type'] === 'SoftwareSourceCode') as Record<string, any> | undefined;
      expect(code, project.slug).toBeDefined();
      expect(code!.name).toBe(project.name);
      expect(code!.codeRepository).toBe(project.code);
      expect(code!.author?.name).toBe(profile.name);
    }
  });

  it('lists every page in a sitemap', () => {
    expect(existsSync('dist/sitemap.xml')).toBe(true);
    const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
    expect(sitemap).toContain(`<loc>${site}</loc>`);
    expect(sitemap).toContain(`<loc>${site}resume/</loc>`);
    for (const project of projects.filter((project) => project.page)) {
      expect(sitemap).toContain(`<loc>${site}projects/${project.slug}/</loc>`);
    }
  });
});
