import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { areas, languages } from '../../src/data/skills';

const html = readFileSync('dist/index.html', 'utf8');
const skills = html.slice(html.indexOf('id="skills"'), html.indexOf('id="contact"'));
const groups = [{ name: 'Languages', skills: languages }, ...areas];

describe('skills', () => {
  it('shows every group with each of its skills as a chip', () => {
    const cells = skills.split('<h3').slice(1);
    for (const group of groups) {
      const cell = cells.find((text) => text.match(/^[^>]*>([^<]*)<\/h3>/)?.[1] === group.name);
      expect(cell, group.name).toBeDefined();
      const chips = [...cell!.matchAll(/class="chip"[^>]*>([^<]*)</g)].map((m) => m[1]);
      expect(chips, group.name).toEqual(group.skills);
    }
  });

  it('follows Languages with the layers in the order the hero names them', () => {
    const order = [...skills.matchAll(/class="group" id="skills-(\w+)"/g)].map((m) => m[1]);
    expect(order.slice(0, 4)).toEqual(['languages', 'frontend', 'backend', 'data']);
    expect(order.indexOf('cloud')).toBeGreaterThan(order.indexOf('data'));
  });
});
