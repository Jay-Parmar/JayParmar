const steps = Array.from({ length: 21 }, (_, i) => i / 20);
const grid = steps.map((v) => steps.map((u) => ({
  x: (10 + 210 * u + 138 * v).toFixed(1),
  y: 94 + 78 * u - 58 * v,
  along: 52 * Math.sin(Math.PI * u) * Math.cos(Math.PI * v),
  across: 52 * Math.cos(Math.PI * u) * Math.sin(Math.PI * v),
})));

/** Project the same cloth from two perpendicular wave directions. */
export function weavePaths(phase: number) {
  const along = Math.cos(phase);
  const across = Math.sin(phase);
  const rows = grid.map((row) => row.map((p) =>
    `${p.x},${(p.y - p.along * along - p.across * across).toFixed(1)}`
  ));
  const columns = steps.map((_, i) => rows.map((row) => row[i]));
  const last = rows.length - 1;
  const edge = [...rows[0], ...columns[last], ...rows[last].slice().reverse(), ...columns[0].slice().reverse()];

  return {
    skin: `M${edge.join(' ')}Z`,
    mesh: [...rows, ...columns].map((wire) => `M${wire.join(' ')}`).join(' '),
    selvedge: `M${rows[0].join(' ')}`,
  };
}
