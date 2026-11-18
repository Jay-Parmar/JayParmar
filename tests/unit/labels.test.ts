import { describe, expect, it } from 'vitest';
import { mapLines, mapStations, type MapStation } from '../../src/data/map';
import type { Point } from '../../src/lib/metro';

// Mukta 700 averages about 0.45em a character. Labels sit on their baseline.
function box({ name, label: { x, y, anchor } }: MapStation, size: number) {
  const width = name.length * size * 0.45;
  const left = anchor === 'start' ? x : anchor === 'end' ? x - width : x - width / 2;
  return { left, right: left + width, top: y - size * 0.7, bottom: y };
}

function along(points: readonly Point[]): Point[] {
  return points.slice(1).flatMap(([bx, by], i) => {
    const [ax, ay] = points[i];
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay)));
    return Array.from({ length: steps + 1 }, (_, s): Point => [ax + ((bx - ax) * s) / steps, ay + ((by - ay) * s) / steps]);
  });
}

describe('map labels', () => {
  // Half a line's width plus the white halo around the text.
  const room = 6;

  for (const size of [17, 21]) {
    it(`keep clear of every line at ${size}px`, () => {
      const touching = mapStations.flatMap((station) => {
        const { left, right, top, bottom } = box(station, size);
        return mapLines
          .filter(({ points }) =>
            along(points).some(
              ([x, y]) => Math.hypot(Math.max(left - x, 0, x - right), Math.max(top - y, 0, y - bottom)) < room,
            ),
          )
          .map(({ line }) => `${station.id} label touches ${line}`);
      });
      expect(touching).toEqual([]);
    });
  }
});
