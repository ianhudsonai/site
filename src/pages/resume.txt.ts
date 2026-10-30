import type { APIRoute } from 'astro';
import { site, links, projects } from '../data/site';

// Served at /resume.txt, and at / for curl/wget (see vercel.json).
export const GET: APIRoute = () => {
  const wrap = (s: string) => s.replace(/(.{1,72})(\s|$)/g, '    $1\n').trimEnd();
  const body = `${site.name}
${site.role}
${site.tagline}

ABOUT
${site.about.map(wrap).join('\n\n')}

PROJECTS
${projects.map((p) => `  ${p.name} [${p.status}]\n${wrap(p.summary)}\n    ${p.href}`).join('\n\n')}

CONTACT
  GitHub    ${links.github}
  LinkedIn  ${links.linkedin}
  X         ${links.x}
  Email     ${links.email}

Web:  ${site.url}
JSON: ${site.url}/resume.json
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
