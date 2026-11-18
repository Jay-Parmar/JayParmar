import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { lines } from '../../src/data/lines';

const html = readFileSync('dist/index.html', 'utf8');
const contact = html.slice(html.indexOf('id="contact"')).replace(/<script[\s\S]*?<\/script>/g, '');

describe('terminus', () => {
  it('ends every line at the contact station', () => {
    const terminus = contact.slice(contact.indexOf('class="terminus"'), contact.indexOf('id="contact-title"'));
    for (const line of lines) expect(terminus).toContain(`--c: var(--${line.id})`);
    expect(terminus).toContain('class="stop"');
  });

  it('is drawn in full until a script holds it back', () => {
    expect(contact).not.toContain('is-waiting');
  });
});
