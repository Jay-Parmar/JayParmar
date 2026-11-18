import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync('dist/index.html', 'utf8');
const section = html
  .slice(html.indexOf('id="results"'), html.indexOf('id="experience"'))
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
});
