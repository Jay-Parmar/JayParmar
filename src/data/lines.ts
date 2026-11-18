export type LineId = 'backend' | 'data' | 'cloud' | 'ml' | 'frontend';

export interface Line {
  id: LineId;
  name: string;
  skills: string[];
}

export const lines: Line[] = [
  {
    id: 'backend',
    name: 'Backend',
    skills: ['FastAPI', 'Django REST Framework', 'Django Channels', 'SQLAlchemy', 'Celery', 'Pydantic', 'asyncio', 'pytest'],
  },
  {
    id: 'data',
    name: 'Data',
    skills: ['PostgreSQL', 'pgvector', 'Kafka', 'Redis', 'SQLite'],
  },
  {
    id: 'cloud',
    name: 'Cloud and DevOps',
    skills: ['AWS (EC2, CloudFormation)', 'Cloudflare', 'Docker', 'GitLab CI/CD', 'GitHub Actions', 'Proxmox', 'Linux', 'Nginx'],
  },
  {
    id: 'ml',
    name: 'Video and ML',
    skills: ['RTSP', 'ONVIF', 'H.264 and H.265', 'FFmpeg', 'go2rtc', 'OpenCV', 'YOLO', 'SigLIP 2', 'DINOv2'],
  },
  {
    id: 'frontend',
    name: 'Frontend and mobile',
    skills: ['React', 'Redux Toolkit', 'React Query', 'Tailwind', 'Flutter', 'Android'],
  },
];

export const languages = ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Kotlin', 'C and C++'];
