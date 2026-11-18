import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { results } from '../../src/data/results';

const html = readFileSync('dist/index.html', 'utf8');
const section = html
  .slice(html.indexOf('id="results"'), html.indexOf('id="projects"'))
  .replace(/<script[\s\S]*?<\/script>/g, '');

describe('results', () => {
  it('is called Impact, like its link in the nav', () => {
    expect(section).toMatch(/<h2[^>]*>Impact<\/h2>/);
  });

  it('does not call the model comparison a before and after', () => {
    expect(section).not.toContain('before and after the change');
  });

  it('animates only the results that measure a change', () => {
    const rows = section.split('<li class="result"').slice(1);
    const accuracy = rows.find((row) => row.includes('Vehicle classification accuracy'));
    expect(accuracy).toBeDefined();
    expect(accuracy).not.toContain('data-start');
    expect(rows.filter((row) => row.includes('data-start'))).toHaveLength(3);
  });

  it('shows each summary as a pill', () => {
    expect(section.match(/<span class="delta"[^>]*>[^<]+<\/span>/g) ?? []).toHaveLength(3);
  });

  it('ships every final figure and no pending state, so it reads without a script', () => {
    expect(section).not.toContain('is-pending');
    for (const result of results) expect(section).toContain(result.afterText);
  });

  it('links each measurement to one entry in the work history', () => {
    const rows = section.split('<li class="result"').slice(1);
    const experience = html.slice(html.indexOf('id="experience"'), html.indexOf('id="skills"'));
    for (const result of results) {
      const row = rows.find((text) => text.includes(result.label)) ?? '';
      const target = row.match(/href="#(work-[^"]+)"/)?.[1];
      expect(target).toBe(`work-${result.id}`);
      expect(experience.match(new RegExp(`<li[^>]*id="${target}"`, 'g'))).toHaveLength(1);
    }
  });
});
