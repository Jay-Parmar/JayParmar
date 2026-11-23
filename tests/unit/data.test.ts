import { describe, expect, it } from 'vitest';
import { education, roles } from '../../src/data/experience';
import { areas, languages } from '../../src/data/skills';
import { profile } from '../../src/data/profile';
import { projects } from '../../src/data/projects';
import { results } from '../../src/data/results';

const areaIds = new Set<string>(areas.map((area) => area.id));

describe('content data', () => {
  it('uses only skill areas that exist', () => {
    const used = roles.flatMap((role) => role.groups.map((group) => group.area));
    expect(used.filter((id) => !areaIds.has(id))).toEqual([]);
  });

  it('keeps every point from the resume, newest role first', () => {
    expect(roles.map((role) => role.id)).toEqual(['essi', 'josh', 'josh-intern']);
    const points = Object.fromEntries(roles.map((role) => [role.id, role.groups.flatMap((g) => g.points).length]));
    expect(points).toEqual({ essi: 9, josh: 2, 'josh-intern': 1 });
    expect(education.id).toBe('education');
  });

  it('gives every project its own slug', () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('links code only to the public GitHub account', () => {
    const links = projects.flatMap((project) => (project.code ? [project.code] : []));
    expect(links.filter((url) => !/^https:\/\/github\.com\/Jay-Parmar\/[\w.-]+$/.test(url))).toEqual([]);
  });

  it('lists the open source projects first, strongest first', () => {
    const open = projects.filter((project) => project.code).map((project) => project.slug);
    expect(open).toEqual(['hirejutsu', 'pin-and-frame', 'hold-my-files', 'foodhub-sniffer']);
    expect(projects.slice(0, open.length).map((project) => project.slug)).toEqual(open);
  });

  it('writes a page only for projects with public code', () => {
    expect(projects.filter((project) => project.page && !project.code)).toEqual([]);
  });

  it('measures every result in positive numbers that differ', () => {
    for (const result of results) {
      expect(result.before).toBeGreaterThan(0);
      expect(result.after).toBeGreaterThan(0);
      expect(result.after).not.toBe(result.before);
    }
  });

  it('sums up each result that has a clear ratio', () => {
    const deltas = Object.fromEntries(results.map((result) => [result.id, result.delta]));
    expect(deltas).toEqual({
      latency: '6× faster',
      stalls: undefined,
      cameras: 'nearly 10× more',
      accuracy: '+14 points',
    });
  });

  it('lists skills in every area and the languages', () => {
    expect(areas.every((area) => area.skills.length > 0)).toBe(true);
    expect(languages.length).toBeGreaterThan(0);
  });

  it('gives contact links that work', () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
    expect(profile.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
    expect(profile.github).toBe('https://github.com/Jay-Parmar');
  });
});
