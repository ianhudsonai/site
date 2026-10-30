// What the project console shows, one entry per project. Every figure is either copy already on the page or read off the
// app's own screenshots in /public/kilo (the logged day) or taco-br-mcp's README (the tool list and the eval).

export interface Fig {
  k: string;
  v: string;
}

export interface Level {
  label: string;
  metric: string;
  caption: string;
  figs: [Fig, Fig, Fig];
}

export interface BarPart {
  n: number;
  label: string;
  tone: 'ink' | 'accent' | 'empty';
}

export interface ConsoleProject {
  id: 'kilo' | 'taco';
  name: string;
  status: string;
  blurb: string;
  href: string;
  cta: string;
  levels: [Level, Level, Level];
  barLabel: string;
  bar: BarPart[];
}

export const consoleProjects: ConsoleProject[] = [
  {
    id: 'kilo',
    name: 'Kilo',
    status: 'Pre-launch',
    blurb: 'An offline-first iPhone app for logging workouts and food, built for Brazilians.',
    href: 'https://kiloapp.com.br',
    cta: 'kiloapp.com.br',
    levels: [
      {
        label: 'Overview',
        metric: 'Pre-launch',
        caption: 'The waitlist is open.',
        figs: [
          { k: 'Platform', v: 'iPhone' },
          { k: 'Works', v: 'Offline' },
          { k: 'Built by', v: '1 person' },
        ],
      },
      {
        label: 'Inside',
        metric: '2 logs',
        caption: 'Food and workouts, in one app.',
        figs: [
          { k: 'Food', v: 'Meals, macros' },
          { k: 'Training', v: 'Sets, reps, RIR' },
          { k: 'Table', v: 'TACO' },
        ],
      },
      {
        label: 'Proof',
        metric: '763 / 2,200',
        caption: 'kcal on one logged day, read off the app’s own screen.',
        figs: [
          { k: 'Protein', v: '59 / 160 g' },
          { k: 'Carbs', v: '106 / 230 g' },
          { k: 'Fat', v: '10 / 70 g' },
        ],
      },
    ],
    barLabel: 'Calories eaten against the daily target in the screenshot',
    bar: [
      { n: 7, label: 'Eaten 763 kcal', tone: 'accent' },
      { n: 13, label: 'Left 1,437 kcal', tone: 'empty' },
    ],
  },
  {
    id: 'taco',
    name: 'taco-br-mcp',
    status: 'Open source',
    blurb: 'An MCP server that gives AI assistants the TACO, the Brazilian food composition table.',
    href: 'https://github.com/ianhudsonai/taco-br-mcp',
    cta: 'GitHub',
    levels: [
      {
        label: 'Overview',
        metric: '6 tools',
        caption: 'One server, one table.',
        figs: [
          { k: 'Source', v: 'TACO 4ª ed.' },
          { k: 'Written in', v: 'TypeScript' },
          { k: 'Status', v: 'Open source' },
        ],
      },
      {
        label: 'Inside',
        metric: '1 call',
        caption: 'A whole meal, added up for the assistant.',
        figs: [
          { k: 'Search', v: 'Accent-blind' },
          { k: 'Units', v: 'IBGE POF' },
          { k: 'Totals', v: 'Gaps flagged' },
        ],
      },
      {
        label: 'Proof',
        metric: '45 / 45',
        caption: 'eval questions answered right with the server, against 32 without it.',
        figs: [
          { k: 'Lookups', v: '18 / 18' },
          { k: 'Household', v: '6 / 6' },
          { k: 'Meals', v: '3 / 3' },
        ],
      },
    ],
    barLabel: 'Eval answers right without the server and with it',
    bar: [
      { n: 32, label: 'Right without it 32', tone: 'ink' },
      { n: 13, label: 'Right only with it 13', tone: 'accent' },
    ],
  },
];
