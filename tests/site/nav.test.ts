import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync('dist/index.html', 'utf8');

describe('section nav', () => {
  it('names itself on phones before any section is reached', () => {
    expect(html).toMatch(/<span class="now"[^>]*>Sections<\/span>/);
  });
});
