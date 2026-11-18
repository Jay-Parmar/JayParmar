import { describe, expect, it } from 'vitest';
import { roles } from '../../src/data/experience';
import { lines } from '../../src/data/lines';
import { mapLines, mapStations, viewBox, type MapStation } from '../../src/data/map';
import { projects } from '../../src/data/projects';
import { nearest, type Point } from '../../src/lib/metro';

const pointsOf = (id: string) => mapLines.find((line) => line.line === id)!.points;

/** Closest a line comes to a station's marker, sampled along the marker. */
function gap(station: MapStation, id: string): number {
  const [[ax, ay], [bx, by]] = station.ends;
  const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay)));
  const samples: Point[] = Array.from({ length: steps + 1 }, (_, i) => [
    ax + ((bx - ax) * i) / steps,
    ay + ((by - ay) * i) / steps,
  ]);
  return Math.min(...samples.map((point) => nearest(pointsOf(id), point).distance));
}

describe('hero map', () => {
  it('draws every line once', () => {
    expect(mapLines.map((line) => line.line).sort()).toEqual(lines.map((line) => line.id).sort());
  });

  it('puts every station on each of its lines', () => {
    const missed = mapStations.flatMap((station) =>
      station.lines.filter((id) => gap(station, id) > 1).map((id) => `${station.id} misses ${id}`),
    );
    expect(missed).toEqual([]);
  });

  it('keeps other lines clear of a station', () => {
    const crowded = mapStations.flatMap((station) =>
      lines
        .map((line) => line.id)
        .filter((id) => !station.lines.includes(id) && gap(station, id) < 16)
        .map((id) => `${station.id} touches ${id}`),
    );
    expect(crowded).toEqual([]);
  });

  it('links each station to its place on the page', () => {
    const ids = new Set(['education', ...roles.map((role) => role.id), ...projects.map((p) => `project-${p.slug}`)]);
    expect(mapStations.map((station) => station.href).filter((href) => !ids.has(href.slice(1)))).toEqual([]);
  });

  it('keeps every station inside the drawing', () => {
    const [width, height] = viewBox;
    const outside = mapStations.filter((station) =>
      station.ends.some(([x, y]) => x < 0 || y < 0 || x > width || y > height),
    );
    expect(outside).toEqual([]);
  });
});
