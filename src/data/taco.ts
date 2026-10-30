import foods from './taco-foods.json';

export interface TacoFood {
  id: number;
  label: string;
  en: string;
  tacoName: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const tacoFoods = foods as TacoFood[];
export const tacoSource = 'TACO 4ª ed. (NEPA/UNICAMP, 2011)';

export interface Plate {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

/** Per 100 g of edible portion, scaled to grams: the same arithmetic taco-br-mcp's calc_meal does. */
export function sumPlate(grams: Record<number, number>): Plate {
  const out: Plate = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  for (const f of tacoFoods) {
    const k = (grams[f.id] ?? 0) / 100;
    out.kcal += f.kcal * k;
    out.protein += f.protein * k;
    out.carbs += f.carbs * k;
    out.fat += f.fat * k;
  }
  return out;
}

export const presets: { key: string; label: string; grams: Record<number, number> }[] = [
  { key: 'lunch', label: 'Lunch', grams: { 3: 150, 561: 100, 410: 120 } },
  { key: 'breakfast', label: 'Breakfast', grams: { 53: 50, 488: 50, 182: 100, 461: 30 } },
  { key: 'clear', label: 'Clear plate', grams: {} },
];

export const tools = [
  { name: 'search_food', does: 'Find foods by Portuguese name, accents ignored. Returns ids and kcal per 100 g.' },
  { name: 'get_nutrients', does: 'The full composition of one food, per 100 g or scaled to grams. Trace stays trace, missing stays null.' },
  { name: 'calc_meal', does: 'Add up nutrients over foods and grams or household measures. A total is flagged when data is missing.' },
  { name: 'compare_foods', does: 'Two to ten foods side by side on the nutrients you pick.' },
  { name: 'convert_household_measure', does: '“2 colheres de sopa” to grams, from the IBGE POF table through a hand-curated mapping.' },
  { name: 'ping', does: 'Health check.' },
] as const;

export const evalRows = [
  { kind: 'Direct lookup', without: '16/18', withMcp: '18/18' },
  { kind: 'Household units', without: '1/6', withMcp: '6/6' },
  { kind: 'Whole meal', without: '0/3', withMcp: '3/3' },
  { kind: 'Honesty', without: '3/6', withMcp: '6/6' },
  { kind: 'Total of 45', without: '32', withMcp: '45' },
] as const;
