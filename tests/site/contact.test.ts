import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { profile } from '../../src/data/profile';

const html = readFileSync('dist/index.html', 'utf8');
const contact = html.slice(html.indexOf('id="contact"'), html.indexOf('<footer')).replace(/<script[\s\S]*?<\/script>/g, '');

describe('contact', () => {
  it('invites people to get in touch', () => {
    expect(contact).toMatch(/<h2[^>]*id="contact-title"[^>]*>Get in touch<\/h2>/);
  });

  it('links to email, LinkedIn and GitHub', () => {
    expect(contact).toContain(`href="mailto:${profile.email}"`);
    expect(contact).toContain(`href="${profile.linkedin}"`);
    expect(contact).toContain(`href="${profile.github}"`);
  });
});
