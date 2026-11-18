import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const paths = [...['src', 'public'].filter(existsSync).flatMap(files), 'README.md'];
const texts = paths.map((path) => ({ path, text: readFileSync(path, 'utf8') }));
const pathsWith = (pattern: RegExp) => texts.filter(({ text }) => pattern.test(text)).map(({ path }) => path);

describe('source text', () => {
  it('has no em dashes', () => {
    expect(pathsWith(/\u2014/)).toEqual([]);
  });

  it('has no en dashes', () => {
    expect(pathsWith(/\u2013/)).toEqual([]);
  });

  it('has no phone numbers', () => {
    expect(pathsWith(/tel:|(?:\+?91[\s-]?)?\b[6-9]\d{4}[\s-]?\d{5}\b/)).toEqual([]);
  });
});
