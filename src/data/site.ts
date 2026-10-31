// Single source of truth. The page, resume.json, resume.txt and llms.txt are all built from this file.

export const site = {
  url: 'https://ianhudson.dev',
  name: 'Ian Hudson Vieira',
  role: 'Developer and founder',
  tagline: 'I build apps and AI tools. Founder of Kilo.',
  description:
    'Ian Hudson Vieira is a builder in São Paulo, Brazil. Kilo is an offline-first iPhone app for logging workouts and food. taco-br-mcp is an open-source MCP server for the TACO food table.',
  location: 'São Paulo, Brazil',
  languages: 'Portuguese, English',
  about: [
    "I'm Ian, a builder in São Paulo.",
    'I build Kilo, an offline-first iPhone app for logging workouts and food, made for Brazilians. It is pre-launch and the waitlist is open at kiloapp.com.br. I also published taco-br-mcp, an open-source MCP server for the TACO table. It is on npm and in the official MCP registry.',
    'I build with generative AI, LLMs and AI coding agents, and I ship fast. I make fitness content on Instagram and TikTok. In February 2027 I start a degree at FIAP.',
  ],
  // The Now section. Update the date whenever the lines change.
  nowUpdated: 'Oct 2026',
  now: [
    'Getting Kilo ready for launch. The waitlist is open at kiloapp.com.br.',
    'Building more small projects in public and posting them here as they ship.',
    'Starting at FIAP in February 2027.',
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
  /** Every link shown on the project's card, the main one first. */
  links: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    name: 'Kilo',
    status: 'Pre-launch',
    summary: 'An offline-first iPhone app for logging workouts and food, made for Brazilians. Pre-launch, waitlist open.',
    href: 'https://kiloapp.com.br',
    cta: 'kiloapp.com.br',
    links: [{ label: 'kiloapp.com.br', href: 'https://kiloapp.com.br' }],
  },
  {
    name: 'taco-br-mcp',
    status: 'Open source',
    summary:
      'An open-source MCP server that gives AI assistants the TACO, the Brazilian food composition table. On npm and in the official MCP registry. 45/45 right answers with the server vs 32/45 without, 90 runs.',
    href: 'https://github.com/ianhudsonai/taco-br-mcp',
    cta: 'GitHub',
    links: [
      { label: 'GitHub', href: 'https://github.com/ianhudsonai/taco-br-mcp' },
      { label: 'npm', href: 'https://www.npmjs.com/package/taco-br-mcp' },
      { label: 'Try the plate', href: '/taco' },
    ],
  },
];
