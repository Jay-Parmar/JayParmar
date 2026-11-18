import { offset, type Point } from '../lib/metro';
import type { LineId } from './lines';

export interface MapLine {
  line: LineId;
  points: Point[];
}

export interface MapStation {
  id: string;
  name: string;
  year: string;
  href: string;
  lines: LineId[];
  /** Where the outermost lines cross the station; the same point twice for a single line. */
  ends: readonly [Point, Point];
  label: { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
}

export const viewBox = [600, 380] as const;

// Backend and frontend leave college together and run side by side through Josh and ESSI.
// Data joins at Josh, ML and cloud at ESSI. Lines 10 apart; backend is the trunk.
const trunk: Point[] = [
  [40, 320],
  [160, 200],
];
const toHirejutsu: Point[] = [
  [420, 200],
  [510, 110],
  [560, 110],
];
const toFoodHub: Point[] = [
  [500, 200],
  [550, 250],
  [580, 250],
];

export const mapLines: MapLine[] = [
  { line: 'backend', points: [...trunk, ...toHirejutsu] },
  { line: 'frontend', points: offset([...trunk, ...toFoodHub], 10) },
  { line: 'data', points: offset([[240, 200], ...toHirejutsu], -10) },
  {
    line: 'ml',
    points: [
      [350, 180],
      [400, 180],
      [600, -20],
    ],
  },
  {
    line: 'cloud',
    points: [
      [350, 220],
      [400, 270],
      [580, 270],
    ],
  },
];

export const mapStations: MapStation[] = [
  {
    id: 'rungta',
    name: 'Rungta College',
    year: '2018',
    href: '#education',
    lines: ['backend', 'frontend'],
    ends: [
      [40, 320],
      [47.07, 327.07],
    ],
    label: { x: 62, y: 342, anchor: 'start' },
  },
  {
    id: 'josh',
    name: 'Josh Technology Group',
    year: '2021',
    href: '#josh',
    lines: ['data', 'backend', 'frontend'],
    ends: [
      [240, 190],
      [240, 210],
    ],
    label: { x: 232, y: 158, anchor: 'end' },
  },
  {
    id: 'essi',
    name: 'ESSI',
    year: '2024',
    href: '#essi',
    lines: ['ml', 'data', 'backend', 'frontend', 'cloud'],
    ends: [
      [350, 180],
      [350, 220],
    ],
    label: { x: 350, y: 146, anchor: 'middle' },
  },
  {
    id: 'hold-my-files',
    name: 'Hold My Files',
    year: '2026',
    href: '#project-hold-my-files',
    lines: ['frontend'],
    ends: [
      [440, 210],
      [440, 210],
    ],
    label: { x: 440, y: 240, anchor: 'middle' },
  },
  {
    id: 'hirejutsu',
    name: 'hirejutsu',
    year: '2026',
    href: '#project-hirejutsu',
    lines: ['data', 'backend'],
    ends: [
      [560, 100],
      [560, 110],
    ],
    label: { x: 560, y: 138, anchor: 'middle' },
  },
  {
    id: 'foodhub-sniffer',
    name: 'FoodHub Sniffer',
    year: '2026',
    href: '#project-foodhub-sniffer',
    lines: ['frontend', 'cloud'],
    ends: [
      [580, 260],
      [580, 270],
    ],
    label: { x: 592, y: 302, anchor: 'end' },
  },
];
