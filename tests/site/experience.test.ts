import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { roles } from '../../src/data/experience';

const html = readFileSync('dist/index.html', 'utf8');
const between = (from: string, to: string) => html.slice(html.indexOf(from), html.indexOf(to));

describe('experience', () => {
  it('head each group of experience', () => {
    const experience = between('id="experience"', 'id="projects"');
    const badges = experience.match(/<h4[^>]*>\s*<span class="badge"/g) ?? [];
    expect(badges).toHaveLength(roles.flatMap((role) => role.groups).length);
  });
});
