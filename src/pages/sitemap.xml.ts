import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { link } from '../lib/url';

/** Every public page, for search engines. */
export const GET: APIRoute = ({ site }) => {
  const paths = ['', ...projects.filter((project) => project.page).map((project) => `projects/${project.slug}/`)];
  const urls = paths.map((path) => `  <url><loc>${new URL(link(path), site)}</loc></url>`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
