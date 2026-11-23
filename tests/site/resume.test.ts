import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { education, roles } from '../../src/data/experience';
import { profile } from '../../src/data/profile';
import { projects } from '../../src/data/projects';
import { areas, languages } from '../../src/data/skills';

const path = 'dist/resume/index.html';
const html = existsSync(path) ? readFileSync(path, 'utf8') : '';
const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
const text = main
  .replace(/<[^>]+>/g, '')
  .replaceAll('&#39;', "'")
  .replaceAll('&amp;', '&')
  .replace(/\s+/g, ' ');
const css = [
  ...[...html.matchAll(/<link rel="stylesheet" href="\/JayParmar\/([^"]+)"/g)].map((m) => readFileSync(join('dist', m[1]), 'utf8')),
  ...[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]),
].join('\n');
const bare = (url: string) => url.replace(/^https:\/\/(www\.)?/, '');

describe('résumé page', () => {
  it('exists under the base path', () => {
    expect(existsSync(path)).toBe(true);
  });

  it('is titled with the name, the role and the word résumé', () => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    expect(title).toContain(profile.name);
    expect(title).toContain(profile.role);
    expect(title).toContain('résumé');
  });

  it('opens with the name, role, location and summary', () => {
    expect(main).toMatch(new RegExp(`<h1[^>]*>${profile.name}</h1>`));
    expect(text).toContain(profile.role);
    expect(text).toContain(profile.location);
    expect(text).toContain(profile.intro);
  });

  it('lists every role and every point, with bold parts and no ** marks', () => {
    for (const role of roles) {
      expect(text).toContain(role.title);
      expect(text).toContain(role.company);
      for (const point of role.groups.flatMap((group) => group.points)) {
        expect(text).toContain(point.text.replaceAll('**', ''));
      }
    }
    expect(main).not.toContain('**');
    expect(main).toMatch(/<strong[^>]*>240\+ cameras<\/strong>/);
  });

  it('shows email, LinkedIn and GitHub as visible links', () => {
    expect(main).toContain(`href="mailto:${profile.email}"`);
    expect(main).toContain(`href="${profile.linkedin}"`);
    expect(main).toContain(`href="${profile.github}"`);
    for (const shown of [profile.email, bare(profile.linkedin), bare(profile.github)]) expect(text).toContain(shown);
  });

  it('never offers a phone number', () => {
    expect(main).not.toBe('');
    expect(html).not.toContain('tel:');
  });

  it('lists the open source projects, the skills and the education', () => {
    for (const project of projects.filter((project) => project.code)) {
      expect(text).toContain(project.name);
      expect(main).toContain(`href="${project.code}"`);
      expect(text).toContain(bare(project.code!));
    }
    for (const area of areas) {
      expect(text).toContain(area.name);
      expect(text).toContain(area.skills.join(', '));
    }
    expect(text).toContain(languages.join(', '));
    expect(text).toContain(education.degree);
    expect(text).toContain(education.school);
  });

  it('ships the Save as PDF button hidden until a script can print', () => {
    const button = main.match(/<button[^>]*>(?:(?!<\/button>)[\s\S])*Save as PDF/)?.[0] ?? '';
    expect(button).toContain('type="button"');
    expect(button).toMatch(/^<button[^>]*\shidden(?=[\s>=])/);
  });

  it('prints on A4 paper without the buttons', () => {
    expect(css).toMatch(/@page\s*\{[^}]*size:\s*A4/);
    expect(css).toMatch(/@media print\s*\{[\s\S]*\.tools[^{]*\{display:none/);
  });

  it('links back to the portfolio', () => {
    expect(main).toContain('href="/JayParmar/"');
  });
});
