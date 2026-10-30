// Builds src/data/taco-foods.json, the dozen foods behind the "weigh a meal" widget, from taco-br-mcp's data/foods.json.
// usage: node scripts/taco-sample.mjs path/to/taco-br-mcp/data/foods.json
import { readFileSync, writeFileSync } from 'node:fs';

const src = JSON.parse(readFileSync(process.argv[2], 'utf8'));
// id in the TACO table, the short label shown on the page, and the grams that start on the plate.
const picks = [
  [3, 'Arroz', 'white rice, cooked', 150],
  [561, 'Feijão', 'carioca beans, cooked', 100],
  [410, 'Frango', 'chicken breast, grilled', 120],
  [488, 'Ovo', 'egg, boiled', 0],
  [53, 'Pão francês', 'French roll', 0],
  [182, 'Banana prata', 'silver banana, raw', 0],
  [129, 'Mandioca', 'cassava, boiled', 0],
  [88, 'Batata-doce', 'sweet potato, boiled', 0],
  [533, 'Cuscuz', 'corn couscous, cooked', 0],
  [131, 'Farofa', 'seasoned cassava flour', 0],
  [461, 'Queijo minas', 'minas fresh cheese', 0],
  [163, 'Abacate', 'avocado, raw', 0],
];

const foods = picks.map(([id, label, en, grams]) => {
  const f = src.foods.find((x) => x.id === id);
  if (!f) throw new Error(`food ${id} not in table`);
  const n = f.nutrients;
  for (const k of ['energy_kcal', 'protein_g', 'carbohydrate_g', 'lipids_g']) {
    if (typeof n[k] !== 'number') throw new Error(`${id} ${k} is not a plain number`);
  }
  return { id, label, en, tacoName: f.name, grams, kcal: n.energy_kcal, protein: n.protein_g, carbs: n.carbohydrate_g, fat: n.lipids_g };
});

writeFileSync(new URL('../src/data/taco-foods.json', import.meta.url), JSON.stringify(foods, null, 2) + '\n');
console.log(foods.map((f) => `${f.id} ${f.tacoName}: ${f.kcal} kcal`).join('\n'));
