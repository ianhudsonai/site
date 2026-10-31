import type { APIRoute } from 'astro';
import { site, links, projects } from '../data/site';

export const GET: APIRoute = () => {
  const body = `# ${site.name}

> ${site.description}

## Projects

${projects.map((p) => `- [${p.name}](${p.href}): ${p.summary}`).join('\n')}
- [Weigh a plate of Brazil](${site.url}/taco): a small demo that adds up a plate from the TACO table, the same data taco-br-mcp serves.
- [taco-br-mcp on npm](https://www.npmjs.com/package/taco-br-mcp)

## Now (updated ${site.nowUpdated})

${site.now.map((l) => `- ${l}`).join('\n')}

## Contact

- [GitHub](${links.github})
- [LinkedIn](${links.linkedin})
- [X](${links.x})
- Email: ${links.email}

## Machine-readable

- [Resume (JSON)](${site.url}/resume.json)
- [Resume (plain text)](${site.url}/resume.txt)
- [Whole site as one document](${site.url}/llms-full.txt)
- [Site index (JSON)](${site.url}/ai-index.json)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
