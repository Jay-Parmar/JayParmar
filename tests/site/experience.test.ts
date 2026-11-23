import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { roles } from '../../src/data/experience';
import { areas } from '../../src/data/skills';

const html = readFileSync('dist/index.html', 'utf8');

describe('experience', () => {
  it('heads each group with its name, and labels the degree as education', () => {
    const experience = html.slice(html.indexOf('id="experience"'), html.indexOf('</section>', html.indexOf('id="experience"')));
    const names = new Map(areas.map((area) => [area.id, area.name]));
    const groups = roles.flatMap((role) => role.groups);
    const headings = [...experience.matchAll(/<h4[^>]*>([^<]*)<\/h4>/g)].map((m) => m[1].trim());
    expect(headings).toEqual([...groups.map((group) => names.get(group.area)), 'Education']);
  });
});
