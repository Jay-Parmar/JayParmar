import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

describe('styles', () => {
  it('give each keyframe animation a name no other file uses, since Astro does not scope them', () => {
    const names = files('src')
      .filter((path) => /\.(astro|css)$/.test(path))
      .flatMap((path) => [...readFileSync(path, 'utf8').matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
    expect(names.filter((name, i) => names.indexOf(name) !== i)).toEqual([]);
  });
});
