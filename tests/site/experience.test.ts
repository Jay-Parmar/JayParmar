import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { roles } from '../../src/data/experience';
import { areas } from '../../src/data/skills';

const html = readFileSync('dist/index.html', 'utf8');
const between = (from: string, to: string) => html.slice(html.indexOf(from), html.indexOf(to));

describe('experience', () => {
  it('heads each group with its name', () => {
    const experience = between('id="experience"', 'id="skills"');
    const names = new Map(areas.map((area) => [area.id, area.name]));
    const groups = roles.flatMap((role) => role.groups);
    const headings = [...experience.matchAll(/<h4[^>]*>([^<]*)<\/h4>/g)].map((m) => m[1].trim());
    expect(headings).toHaveLength(groups.length);
    expect(headings).toEqual(groups.map((group) => names.get(group.area)));
  });
});
