import type { APIRoute } from 'astro';
import { site, links, projects } from '../data/site';

export const GET: APIRoute = () => {
  const body = `# ${site.name}

> ${site.description}

## Projects

${projects.map((p) => `- [${p.name}](${p.href}): ${p.summary}`).join('\n')}

## Contact

- [GitHub](${links.github})
- [LinkedIn](${links.linkedin})
- [X](${links.x})
- Email: ${links.email}

## Machine-readable

- [Resume (JSON)](${site.url}/resume.json)
- [Resume (plain text)](${site.url}/resume.txt)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
