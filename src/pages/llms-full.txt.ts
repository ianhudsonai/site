import type { APIRoute } from 'astro';
import { site, links, projects } from '../data/site';

// The whole site as one plain-text document, for agents that want everything in a single fetch.
export const GET: APIRoute = () => {
  const body = `# ${site.name}

${site.role}. ${site.tagline}

Source: ${site.url}
Based in ${site.location}. Speaks ${site.languages}.

## About

${site.about.join('\n\n')}

## Projects

${projects.map((p) => `### ${p.name} (${p.status})\n\n${p.summary}\n\n${p.links.map((l) => `- ${l.label}: ${l.href.startsWith('/') ? site.url + l.href : l.href}`).join('\n')}`).join('\n\n')}

## Now (updated ${site.nowUpdated})

${site.now.map((l) => `- ${l}`).join('\n')}

## Contact

- GitHub: ${links.github}
- LinkedIn: ${links.linkedin}
- X: ${links.x}
- Email: ${links.email}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
