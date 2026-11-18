import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { lines } from '../../src/data/lines';

const html = readFileSync('dist/index.html', 'utf8');
const between = (from: string, to: string) => html.slice(html.indexOf(from), html.indexOf(to));

describe('skills', () => {
  it('name each line in the skills legend', () => {
    const skills = between('id="skills"', 'id="contact"');
    for (const line of lines) expect(skills).toMatch(new RegExp(`<span class="badge"[^>]*>${line.name}</span>`));
  });
});
