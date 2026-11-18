import type { LineId } from './lines';

export interface Result {
  id: string;
  label: string;
  context: string;
  line: LineId;
  before: number;
  after: number;
  unit: string;
  beforeText: string;
  afterText: string;
  beforeName: string;
  afterName: string;
}

export const results: Result[] = [
  {
    id: 'latency',
    label: 'API response time, 95th percentile',
    context: 'While preparing a product for STQC certification and VAPT.',
    line: 'backend',
    before: 755,
    after: 125,
    unit: 'ms',
    beforeText: '755 ms',
    afterText: '125 ms',
    beforeName: 'Before',
    afterName: 'After',
  },
  {
    id: 'stalls',
    label: 'Live-view stalls under load',
    context: 'Load test with 100 operators and 70 live viewers, on a harness I wrote.',
    line: 'backend',
    before: 19,
    after: 1,
    unit: 's',
    beforeText: 'up to 19 s',
    afterText: 'about 1 s',
    beforeName: 'Before',
    afterName: 'After',
  },
  {
    id: 'cameras',
    label: 'Cameras on one video platform',
    context: 'Scaled with the multi-server architecture I designed.',
    line: 'cloud',
    before: 25,
    after: 240,
    unit: '',
    beforeText: '25',
    afterText: '240+',
    beforeName: 'Before',
    afterName: 'After',
  },
  {
    id: 'accuracy',
    label: 'Vehicle classification accuracy',
    context: 'On 100 labelled vehicle crops: the deployed model against SigLIP 2 with a trained head.',
    line: 'ml',
    before: 81,
    after: 95,
    unit: '%',
    beforeText: '81%',
    afterText: '95%',
    beforeName: 'Deployed model',
    afterName: 'SigLIP 2 head',
  },
];
