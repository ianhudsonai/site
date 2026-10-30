import type { APIRoute } from 'astro';
import { site, links, projects } from '../data/site';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: site.name,
        role: site.role,
        tagline: site.tagline,
        url: site.url,
        location: site.location,
        languages: site.languages.split(', '),
        summary: site.description,
        about: site.about,
        links: { github: links.github, linkedin: links.linkedin, x: links.x, email: links.email },
        projects: projects.map(({ name, status, summary, href }) => ({ name, status, summary, url: href })),
        now: { updated: site.nowUpdated, lines: site.now },
      },
      null,
      2,
    ) + '\n',
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
