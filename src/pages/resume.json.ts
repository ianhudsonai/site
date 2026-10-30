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
        summary: site.description,
        links: { github: links.github, linkedin: links.linkedin, x: links.x, email: links.email },
        projects: projects.map(({ name, status, summary, href }) => ({ name, status, summary, url: href })),
      },
      null,
      2,
    ) + '\n',
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
