// Single source of truth. The page, resume.json, resume.txt and llms.txt are all built from this file.

export const site = {
  url: 'https://ianhudson.dev',
  name: 'Ian Hudson Vieira',
  role: 'Developer and founder',
  tagline: 'I build apps and AI tools. Founder of Kilo.',
  description:
    'Ian Hudson Vieira is a developer and solo founder building Kilo, an offline-first iPhone app for workout and food logging, and open tools like taco-br-mcp.',
  about: [
    "I'm a developer and solo founder. I design and build everything myself, from the app to the tooling around it.",
    'My main project is Kilo, an offline-first iPhone app for logging workouts and food, made for Brazilians. I also publish open-source tools, like an MCP server that gives AI assistants access to Brazilian nutrition data.',
    'More projects will land here as they ship.',
  ],
} as const;

export const links = {
  github: 'https://github.com/ianhudsonai',
  linkedin: 'https://www.linkedin.com/in/ianhudsonvieira/',
  x: 'https://x.com/ianhudsonai',
  email: 'ianhudson.ai@gmail.com',
} as const;

export interface Project {
  name: string;
  status: string;
  summary: string;
  href: string;
  cta: string;
}

export const projects: Project[] = [
  {
    name: 'Kilo',
    status: 'Pre-launch',
    summary:
      'An offline-first iPhone app for logging workouts and food, built for Brazilians. Designed and built solo. Join the waitlist.',
    href: 'https://kiloapp.com.br',
    cta: 'kiloapp.com.br',
  },
  {
    name: 'taco-br-mcp',
    status: 'Open source',
    summary:
      'An MCP server in TypeScript that gives AI assistants the TACO, the Brazilian Food Composition Table: search foods, read nutrients, compare foods and calculate meals.',
    href: 'https://github.com/ianhudsonai/taco-br-mcp',
    cta: 'github.com/ianhudsonai/taco-br-mcp',
  },
  // Add the npm link to taco-br-mcp here once the package is published.
];
