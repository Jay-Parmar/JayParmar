import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync('dist/index.html', 'utf8');
const section = html.slice(html.indexOf('id="results"'), html.indexOf('id="experience"'));

describe('results', () => {
  it('does not call the model comparison a before and after', () => {
    expect(section).not.toContain('before and after the change');
  });
});
