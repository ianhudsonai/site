import type { APIRoute } from 'astro';
import { site, links, projects } from '../data/site';

// A small map of the site for agents: what exists, where, and in which format.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: site.name,
        url: site.url,
        description: site.description,
        updated: new Date().toISOString().slice(0, 10),
        pages: [{ path: '/', title: `${site.name}: ${site.role}`, summary: site.tagline }],
        machineReadable: {
          resumeJson: `${site.url}/resume.json`,
          resumeText: `${site.url}/resume.txt`,
          llmsTxt: `${site.url}/llms.txt`,
          llmsFullTxt: `${site.url}/llms-full.txt`,
          sitemap: `${site.url}/sitemap-index.xml`,
        },
        projects: projects.map((p) => ({ name: p.name, status: p.status, url: p.href })),
        contact: { email: links.email, github: links.github, linkedin: links.linkedin, x: links.x },
        note: 'Run `curl ianhudson.dev` for a plain-text résumé.',
      },
      null,
      2,
    ) + '\n',
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
