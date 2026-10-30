import type { APIRoute } from 'astro';
import { site, links, projects } from '../data/site';

// The whole site as one plain-text document, for agents that want everything in a single fetch.
export const GET: APIRoute = () => {
  const body = `# ${site.name}

${site.role}. ${site.tagline}

Source: ${site.url}

## About

${site.about.join('\n\n')}

## Projects

${projects.map((p) => `### ${p.name} (${p.status})\n\n${p.summary}\n\n${p.href}`).join('\n\n')}

## Contact

- GitHub: ${links.github}
- LinkedIn: ${links.linkedin}
- X: ${links.x}
- Email: ${links.email}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
