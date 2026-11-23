import { describe, expect, it } from 'vitest';
import { emphasis } from '../../src/lib/emphasis';

describe('emphasis', () => {
  it('puts the text between ** marks at the odd positions', () => {
    expect(emphasis('Scaled it to **240+ cameras** in **2024**.')).toEqual(['Scaled it to ', '240+ cameras', ' in ', '2024', '.']);
  });

  it('leaves plain text whole', () => {
    expect(emphasis('Led a team of 4.')).toEqual(['Led a team of 4.']);
  });
});
