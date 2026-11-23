import { education, roles } from '../data/experience';
import { profile } from '../data/profile';
import type { Project } from '../data/projects';
import { areas, languages } from '../data/skills';

/** Structured data that tells search engines who the site is about. */
export function personSchema(site: string) {
  const current = roles.find((role) => role.end === 'Present') ?? roles[0];
  const [locality] = profile.location.split(', ');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${site}#website`, url: site, name: profile.name, inLanguage: 'en' },
      {
        '@type': 'Person',
        '@id': `${site}#person`,
        name: profile.name,
        url: site,
        email: `mailto:${profile.email}`,
        jobTitle: current.title,
        worksFor: { '@type': 'Organization', name: current.company },
        address: { '@type': 'PostalAddress', addressLocality: locality, addressCountry: 'IN' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
        sameAs: [profile.linkedin, profile.github],
        knowsAbout: [...languages, ...areas.flatMap((area) => area.skills)],
      },
    ],
  };
}

/** Structured data for one project's case study. */
export function projectSchema(project: Project, home: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.name,
    description: project.tagline,
    codeRepository: project.code,
    keywords: project.stack.join(', '),
    dateCreated: project.year,
    author: { '@type': 'Person', name: profile.name, url: home },
  };
}
