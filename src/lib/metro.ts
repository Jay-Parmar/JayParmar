export type Point = readonly [number, number];

const round = (value: number, places: number) => String(Number(value.toFixed(places)));

/** SVG path data for a polyline, like M0 0L10 0. */
export function pathData(points: readonly Point[]): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${round(x, 2)} ${round(y, 2)}`).join('');
}

export function polylineLength(points: readonly Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return total;
}

/** The polyline moved `distance` to the right of its direction of travel, with mitred corners. */
export function offset(points: readonly Point[], distance: number): Point[] {
  const normals = points.slice(1).map((point, i) => {
    const dx = point[0] - points[i][0];
    const dy = point[1] - points[i][1];
    const length = Math.hypot(dx, dy);
    return [-dy / length, dx / length] as const;
  });
  return points.map(([x, y], i) => {
    const a = normals[Math.max(0, i - 1)];
    const b = normals[Math.min(normals.length - 1, i)];
    const scale = distance / (1 + a[0] * b[0] + a[1] * b[1]);
    return [x + (a[0] + b[0]) * scale, y + (a[1] + b[1]) * scale] as const;
  });
}

/** The closest place on the polyline to a point, as a share of the line's length. */
export function nearest(points: readonly Point[], at: Point): { fraction: number; distance: number } {
  const total = polylineLength(points);
  let best = { fraction: 0, distance: Infinity };
  let walked = 0;

  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const length = Math.hypot(bx - ax, by - ay);
    const t = length ? Math.min(1, Math.max(0, ((at[0] - ax) * (bx - ax) + (at[1] - ay) * (by - ay)) / length ** 2)) : 0;
    const distance = Math.hypot(ax + t * (bx - ax) - at[0], ay + t * (by - ay) - at[1]);
    if (distance < best.distance) best = { fraction: (walked + t * length) / total, distance };
    walked += length;
  }

  return best;
}

/**
 * keyPoints and keyTimes for an animateMotion round trip over the stops,
 * waiting `dwell` of the loop at each stop and moving at a steady speed.
 */
export function trainTiming(stops: readonly number[], dwell: number): { keyPoints: string; keyTimes: string } {
  const route = [...stops, ...stops.slice(0, -1).reverse()];
  let distance = 0;
  for (let i = 1; i < route.length; i++) distance += Math.abs(route[i] - route[i - 1]);
  const travel = 1 - dwell * route.length;

  const points: number[] = [];
  const times: number[] = [];
  let time = 0;
  route.forEach((stop, i) => {
    if (i) time += (travel * Math.abs(stop - route[i - 1])) / distance;
    points.push(stop, stop);
    times.push(time, time + dwell);
    time += dwell;
  });

  const join = (values: number[]) => values.map((value) => round(value, 4)).join(';');
  return { keyPoints: join(points), keyTimes: join(times) };
}
