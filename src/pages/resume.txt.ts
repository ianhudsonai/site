import type { APIRoute } from 'astro';
import { site, links, projects } from '../data/site';

// Served at /resume.txt, and at / for curl/wget (see vercel.json).
export const GET: APIRoute = () => {
  const wrap = (s: string) => s.replace(/(.{1,72})(\s|$)/g, '    $1\n').trimEnd();
  const body = `${site.name}
${site.role}
${site.tagline}
${site.location}. ${site.languages}.

ABOUT
${site.about.map(wrap).join('\n\n')}

PROJECTS
${projects.map((p) => `  ${p.name} [${p.status}]\n${wrap(p.summary)}\n${p.links.map((l) => `    ${l.href.startsWith('/') ? site.url + l.href : l.href}`).join('\n')}`).join('\n\n')}

NOW (updated ${site.nowUpdated})
${site.now.map((l) => wrap(`- ${l}`)).join('\n')}

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
