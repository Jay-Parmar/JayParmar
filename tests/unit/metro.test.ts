import { describe, expect, it } from 'vitest';
import { nearest, offset, pathData, polylineLength, trainTiming } from '../../src/lib/metro';

const corner = [
  [0, 0],
  [10, 0],
  [10, 10],
] as const;

describe('metro geometry', () => {
  it('draws a path through the points', () => {
    expect(pathData(corner)).toBe('M0 0L10 0L10 10');
  });

  it('rounds coordinates to two places', () => {
    expect(pathData([[1 / 3, 2.5], [4, 7.125]])).toBe('M0.33 2.5L4 7.13');
  });

  it('measures a polyline', () => {
    expect(polylineLength(corner)).toBe(20);
  });

  it('places a point on the line by how far along it sits', () => {
    expect(nearest(corner, [10, 0])).toEqual({ fraction: 0.5, distance: 0 });
    expect(nearest(corner, [10, 5])).toEqual({ fraction: 0.75, distance: 0 });
  });

  it('finds the closest place on the line for a point off it', () => {
    const { fraction, distance } = nearest(corner, [5, 3]);
    expect(fraction).toBeCloseTo(0.25);
    expect(distance).toBeCloseTo(3);
  });

  it('times a round trip that waits at every stop', () => {
    expect(trainTiming([0, 0.5, 1], 0.1)).toEqual({
      keyPoints: '0;0;0.5;0.5;1;1;0.5;0.5;0;0',
      keyTimes: '0;0.1;0.225;0.325;0.45;0.55;0.675;0.775;0.9;1',
    });
  });

  it('offsets a straight line to the right of travel', () => {
    expect(offset([[0, 0], [10, 0]], 5)).toEqual([[0, 5], [10, 5]]);
  });

  it('keeps parallel lines apart around a bend', () => {
    const [start, corner, end] = offset([[0, 100], [100, 0], [200, 0]], 10);
    expect(start[0]).toBeCloseTo(7.071);
    expect(start[1]).toBeCloseTo(107.071);
    expect(corner[0]).toBeCloseTo(104.142);
    expect(corner[1]).toBeCloseTo(10);
    expect(end).toEqual([200, 10]);
  });
});
