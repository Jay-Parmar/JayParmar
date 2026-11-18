export interface Result {
  id: string;
  /** A change I made, or two things I compared side by side. */
  kind: 'change' | 'comparison';
  label: string;
  context: string;
  before: number;
  after: number;
  beforeText: string;
  afterText: string;
  beforeName: string;
  afterName: string;
  /** The change in a few words, when the ratio is exact enough to say. */
  delta?: string;
}

export const results: Result[] = [
  {
    id: 'latency',
    kind: 'change',
    label: 'API response time, 95th percentile',
    context: 'While preparing a product for STQC certification and VAPT.',
    before: 755,
    after: 125,
    beforeText: '755 ms',
    afterText: '125 ms',
    beforeName: 'Before',
    afterName: 'After',
    delta: '6× faster',
  },
  {
    id: 'stalls',
    kind: 'change',
    label: 'Live-view stalls under load',
    context: 'Load test with 100 operators and 70 live viewers, on a harness I wrote.',
    before: 19,
    after: 1,
    beforeText: 'up to 19 s',
    afterText: 'about 1 s',
    beforeName: 'Before',
    afterName: 'After',
  },
  {
    id: 'cameras',
    kind: 'change',
    label: 'Cameras on one video platform',
    context: 'Scaled with the multi-server architecture I designed.',
    before: 25,
    after: 240,
    beforeText: '25',
    afterText: '240+',
    beforeName: 'Before',
    afterName: 'After',
    delta: 'nearly 10× more',
  },
  {
    id: 'accuracy',
    kind: 'comparison',
    label: 'Vehicle classification accuracy',
    context: 'On 100 labelled vehicle crops: the deployed model against SigLIP 2 with a trained head.',
    before: 81,
    after: 95,
    beforeText: '81%',
    afterText: '95%',
    beforeName: 'Deployed model',
    afterName: 'SigLIP 2 head',
    delta: '+14 points',
  },
];
