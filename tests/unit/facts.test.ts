import { describe, expect, it } from 'vitest';
import { splitFact } from '../../src/lib/facts';

describe('splitFact', () => {
  it('splits off the number a fact starts with', () => {
    expect(splitFact('629 company career pages')).toEqual(['629', 'company career pages']);
    expect(splitFact('2,000+ tests')).toEqual(['2,000+', 'tests']);
  });

  it('leaves a fact without a leading number whole', () => {
    expect(splitFact('No cloud, no internet')).toEqual([undefined, 'No cloud, no internet']);
    expect(splitFact('CI on every push')).toEqual([undefined, 'CI on every push']);
  });
});
