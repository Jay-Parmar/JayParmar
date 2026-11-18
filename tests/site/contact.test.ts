import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { profile } from '../../src/data/profile';

const html = readFileSync('dist/index.html', 'utf8');
const contact = html.slice(html.indexOf('id="contact"'), html.indexOf('<footer')).replace(/<script[\s\S]*?<\/script>/g, '');

describe('contact', () => {
  it('invites people to get in touch', () => {
    expect(contact).toMatch(/<h2[^>]*id="contact-title"[^>]*>Get in touch<\/h2>/);
  });

  it('ships the copy button hidden until a script finds a clipboard', () => {
    const button = contact.match(/<button[^>]*data-copy="([^"]*)"[^>]*>/);
    expect(button?.[1]).toBe(profile.email);
    expect(button?.[0]).toMatch(/\shidden(?=[\s>=])/);
  });

  it('has a polite live region to announce the copy', () => {
    expect(contact).toMatch(/<[^>]+aria-live="polite"/);
  });

  it('links to email, LinkedIn and GitHub', () => {
    expect(contact).toContain(`href="mailto:${profile.email}"`);
    expect(contact).toContain(`href="${profile.linkedin}"`);
    expect(contact).toContain(`href="${profile.github}"`);
  });
});
