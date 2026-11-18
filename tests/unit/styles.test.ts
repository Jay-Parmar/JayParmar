import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const sources = files('src')
  .filter((path) => /\.(astro|css)$/.test(path))
  .map((path) => readFileSync(path, 'utf8'));

describe('styles', () => {
  it('use every token they define', () => {
    const css = readFileSync('src/styles/global.css', 'utf8');
    const root = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
    const text = sources.join('\n');
    const defined = [...root.matchAll(/--([\w-]+):/g)].map((m) => m[1]);
    expect(defined.filter((name) => !new RegExp(`var\\(--${name}[,)\\s]`).test(text))).toEqual([]);
  });

  it('give each keyframe animation a name no other file uses, since Astro does not scope them', () => {
    const names = sources.flatMap((text) => [...text.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
    expect(names.filter((name, i) => names.indexOf(name) !== i)).toEqual([]);
  });
});
