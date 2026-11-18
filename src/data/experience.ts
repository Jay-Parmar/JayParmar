import type { AreaId } from './skills';

interface Point {
  text: string;
  result?: string;
}

export interface Role {
  id: string;
  title: string;
  company: string;
  place: string;
  start: string;
  end: string;
  groups: { area: AreaId; points: Point[] }[];
}

/** Newest first. Text between ** marks is shown in bold. */
export const roles: Role[] = [
  {
    id: 'essi',
    title: 'Full Stack Developer',
    company: 'ESSI Integrated Technologies Pvt Ltd',
    place: 'New Delhi',
    start: 'Apr 2024',
    end: 'Present',
    groups: [
      {
        area: 'backend',
        points: [
          {
            result: 'cameras',
            text: 'Designed a FastAPI control plane for a state police network. It assigns work across servers and generates Docker Compose and nginx configuration for each host. The platform grew from 25 to **240+ cameras**.',
          },
          {
            result: 'stalls',
            text: 'Built a load-test harness for **100 operators** and 70 live viewers. Moved host health checks off the request path and cut live-view stalls from up to 19 s to **about 1 s**.',
          },
          {
            result: 'latency',
            text: 'Prepared a product for STQC certification and VAPT with role-scoped APIs and WebSockets, session revocation, a hash-chained audit trail, and semgrep and gitleaks release gates. API p95 fell from **755 to 125 ms**.',
          },
          { text: "Led a team of 3 on UVSS, a Django and Celery system that rebuilds a vehicle's underside as a 3D point cloud in **about 4 s**, with 75% test coverage." },
        ],
      },
      {
        area: 'cloud',
        points: [
          { text: 'Managed AWS for several products: HTTPS behind Cloudflare with Origin CA certificates, security groups open only to the office and Cloudflare, and CloudFormation changes that keep instances in place.' },
          { text: 'Built a gated release path for an ERSS-112 command centre where a pull agent on EC2 deploys only commits that pass every test and security gate, after a backup and with no inbound access.' },
          { text: 'Ran Ubuntu VMs and LXC containers on Proxmox with failover, moved releases to Docker and GitLab CI/CD for **70% faster** updates, and built offline install kits for sites with no internet.' },
        ],
      },
      {
        area: 'data',
        points: [
          { text: 'Designed a detection pipeline: Kafka consumers write events to PostgreSQL, with pgvector face search and a pg_trgm prefilter for an OCR-aware Damerau-Levenshtein plate matcher over **11,000 plates**.' },
        ],
      },
      {
        area: 'ml',
        points: [
          {
            result: 'accuracy',
            text: 'Audited vehicle analytics and found a TensorRT export bug that forced a PyTorch fallback. On 100 labelled vehicle crops, a trained SigLIP 2 head scored **95%**, compared with 81% for the deployed model.',
          },
        ],
      },
    ],
  },
  {
    id: 'josh',
    title: 'Software Developer',
    company: 'Josh Technology Group',
    place: 'Gurugram, Haryana',
    start: 'Jul 2022',
    end: 'Aug 2023',
    groups: [
      {
        area: 'backend',
        points: [
          { text: 'Core developer on a recruitment platform with **200k+ daily users**. Owned Django REST endpoints and PostgreSQL schema work, and kept it responsive with pagination and query tuning.' },
          { text: 'Led a team of 4 through feature deliveries and handled releases with the product and client teams.' },
        ],
      },
    ],
  },
  {
    id: 'josh-intern',
    title: 'Software Development Intern',
    company: 'Josh Technology Group',
    place: 'Gurugram, Haryana',
    start: 'Sep 2021',
    end: 'Jun 2022',
    groups: [
      {
        area: 'frontend',
        points: [{ text: "Built reusable web components and shipped production features using the team's CI and testing setup." }],
      },
    ],
  },
];

export const education = {
  id: 'education',
  school: 'Rungta College of Engineering and Technology',
  degree: 'Bachelor of Technology, Computer Science',
  place: 'Bhilai, Chhattisgarh',
  start: 'Aug 2018',
  end: 'Jun 2022',
};
