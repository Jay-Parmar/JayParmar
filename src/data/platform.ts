export const platform = {
  title: 'Multi-server video platform',
  description: 'Cameras feed video hosts managed by a FastAPI control plane. The hosts serve the live view to operators.',
  cameras: 'Cameras',
  protocols: 'RTSP, ONVIF',
  control: 'Control plane',
  framework: 'FastAPI',
  hosts: ['host-01', 'host-02', 'host-03'],
  output: 'Live view',
  audience: 'Operators',
  viewLabel: 'Explore the architecture',
  views: [
    {
      id: 'overview',
      label: 'Overview',
      note: 'I designed the control plane at ESSI to run a fleet of video servers as one system.',
    },
    {
      id: 'allocation',
      label: 'Work allocation',
      note: 'The control plane assigns work to each host and generates its Docker Compose and nginx configuration.',
    },
    {
      id: 'playback',
      label: 'Live view',
      note: 'The hosts serve streams to operators. I load tested the system with 100 operators and 70 live viewers.',
    },
  ],
};
