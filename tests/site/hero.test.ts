import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { roles } from '../../src/data/experience';
import { profile } from '../../src/data/profile';

const html = readFileSync('dist/index.html', 'utf8');
const hero = html.match(/<section[^>]*id="top"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
const study = html.slice(html.indexOf('id="architecture"'), html.indexOf('</section>', html.indexOf('id="architecture"')));
const figure = study.match(/<figure class="system"[^>]*>[\s\S]*?<\/figure>/)?.[0] ?? '';

describe('hero', () => {
  it('leads with the name', () => {
    expect(html).toMatch(new RegExp(`<h1[^>]*>${profile.name}</h1>`));
  });

  it('shows the role on the page and uses the same title in link previews', () => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    expect(title).toContain(profile.name);
    expect(html.match(/<meta property="og:title" content="([^"]+)"/)?.[1]).toBe(title);
    expect(html.match(/<p class="role"[^>]*>([^<]+)<\/p>/)?.[1]).toBe('Software Developer');
  });

  it('links directly to the project list and current role from the introduction', () => {
    const current = roles.find((role) => role.end === 'Present')!;
    expect(hero).toMatch(/<a[^>]*href="#projects"[^>]*>View projects<\/a>/);
    expect(hero).toContain(`href="#${current.id}"`);
    expect(hero).toContain(`href="mailto:${profile.email}"`);
  });

  it('introduces the full stack practice and puts the platform in a separate case study', () => {
    for (const label of ['Interfaces', 'Services and data', 'Infrastructure']) expect(hero).toContain(label);
    expect(hero).not.toContain('Multi-server video platform');
    expect(study).toContain('Multi-server video platform');
    for (const view of ['overview', 'allocation', 'playback']) expect(study).toContain(`id="chapter-${view}"`);
  });

  it('ships a still weave and reveals its pause control when motion is available', () => {
    expect(hero).toMatch(/<path class="mesh"[^>]* d="M[^"]+"/);
    const control = hero.match(/<button\b[^>]*data-weave-control[^>]*>/)?.[0] ?? '';
    expect(control).toContain('aria-label="Pause weave animation"');
    expect(control).toMatch(/\shidden(?=[\s>=])/);
  });

  it('draws the system I designed, with a label of its own and a caption', () => {
    for (const part of ['Cameras', 'Control plane', 'host-01', 'host-02', 'host-03', 'Live view']) {
      expect(figure).toContain(`>${part}<`);
    }
    const label = figure.match(/<svg[^>]*role="img"[^>]*aria-label="([^"]+)"/)?.[1] ?? '';
    expect(label).toMatch(/cameras.*hosts.*live view/i);
    const caption = figure.slice(figure.indexOf('<figcaption')).replace(/<[^>]+>/g, ' ');
    expect(caption).toMatch(/control plane/i);
  });

  it('ships three labelled diagram views with a description for each', () => {
    const choices = figure.match(/<input\b[^>]*type="radio"[^>]*>/g) ?? [];
    expect(choices).toHaveLength(3);
    expect(choices.filter((choice) => choice.includes(' checked'))).toHaveLength(1);
    for (const [i, choice] of choices.entries()) {
      const id = choice.match(/\bid="([^"]+)"/)?.[1];
      const note = choice.match(/aria-describedby="([^"]+)"/)?.[1];
      const label = ['Overview', 'Work allocation', 'Live view'][i];
      expect(figure).toMatch(new RegExp(`<label[^>]*for="${id}"[^>]*>${label}</label>`));
      expect(figure).toMatch(new RegExp(`<span[^>]*id="${note}"[^>]*>[^<]{20,}</span>`));
    }
  });

  it('keeps each packet out of sight until it starts moving', () => {
    const packets = [...figure.matchAll(/<g class="packet"[^>]*>([\s\S]*?)<\/g>/g)];
    expect(packets.length).toBeGreaterThan(0);
    for (const [group, inner] of packets) {
      expect(group).toContain('visibility="hidden"');
      const begin = inner.match(/<animateMotion[^>]*begin="([^"]+)"/)![1];
      expect(inner).toMatch(new RegExp(`<set attributeName="visibility" to="visible" begin="${begin}"`));
    }
  });
});
