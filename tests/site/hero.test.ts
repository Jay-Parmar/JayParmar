import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { profile } from '../../src/data/profile';

const html = readFileSync('dist/index.html', 'utf8');
const figure = html.slice(html.indexOf('<figure class="system"'), html.indexOf('</figure>'));

describe('hero', () => {
  it('leads with the name', () => {
    expect(html).toMatch(new RegExp(`<h1[^>]*>${profile.name}</h1>`));
  });

  it('draws the system I designed, described by its caption', () => {
    for (const part of ['Cameras', 'Control plane', 'host-01', 'host-02', 'host-03', 'Live view']) {
      expect(figure).toContain(`>${part}<`);
    }
    expect(figure).toMatch(/<svg[^>]*role="img"[^>]*aria-labelledby="system-caption"/);
    expect(figure).toMatch(/<figcaption[^>]*id="system-caption"[^>]*>[^<]*control plane/i);
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
