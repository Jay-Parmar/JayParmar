import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects';

const html = readFileSync('dist/index.html', 'utf8');
const between = (from: string, to: string) => html.slice(html.indexOf(from), html.indexOf(to));

describe('projects', () => {
  it('mark the lines of every project', () => {
    const section = between('id="projects"', 'id="skills"');
    expect(section.match(/<span class="badge"/g)?.length).toBe(projects.flatMap((project) => project.lines).length);
  });
});
