// The weigh-a-meal widget. The server renders a lunch plate, so the page is complete without this script;
// the script only makes the sliders and presets work. Arithmetic: value per 100 g * grams / 100.
interface Food { id: number; label: string; kcal: number; protein: number; carbs: number; fat: number }
interface Preset { key: string; grams: Record<string, number> }

const root = document.querySelector<HTMLElement>('[data-meal]');
if (root) {
  const foods: Food[] = JSON.parse(root.dataset.foods ?? '[]');
  const presets: Preset[] = JSON.parse(root.dataset.presets ?? '[]');
  const rows = new Map<number, HTMLElement>();
  root.querySelectorAll<HTMLElement>('.row').forEach((r) => rows.set(Number(r.dataset.food), r));

  const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const totalEl = q('[data-total]');
  const proteinEl = q('[data-protein]');
  const carbsEl = q('[data-carbs]');
  const fatEl = q('[data-fat]');
  const bar = q('[data-bar]');
  const legend = q('[data-legend]');
  const req = q('[data-req]');
  const swatch = ['var(--accent)', 'var(--fg)', '#7d7a73'];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const grams = () => {
    const g: Record<number, number> = {};
    rows.forEach((row, id) => (g[id] = Number(row.querySelector<HTMLInputElement>('input')!.value)));
    return g;
  };

  let shown = Number(totalEl.textContent) || 0;
  let raf = 0;
  function showTotal(to: number) {
    cancelAnimationFrame(raf);
    if (calm) { shown = to; totalEl.textContent = String(Math.round(to)); return; }
    const from = shown;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 380);
      const e = 1 - Math.pow(1 - k, 3);
      shown = from + (to - from) * e;
      totalEl.textContent = String(Math.round(shown));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  function update() {
    const g = grams();
    let kcal = 0, protein = 0, carbs = 0, fat = 0;
    const parts: { f: Food; kcal: number }[] = [];
    for (const f of foods) {
      const k = (g[f.id] ?? 0) / 100;
      kcal += f.kcal * k; protein += f.protein * k; carbs += f.carbs * k; fat += f.fat * k;
      if (k > 0) parts.push({ f, kcal: f.kcal * k });
    }
    showTotal(kcal);
    proteinEl.textContent = protein.toFixed(1);
    carbsEl.textContent = carbs.toFixed(1);
    fatEl.textContent = fat.toFixed(1);

    const sum = parts.reduce((a, p) => a + p.kcal, 0) || 1;
    bar.replaceChildren(...parts.map((p, i) => {
      const s = document.createElement('span');
      s.style.cssText = `flex:${p.kcal / sum};background:${swatch[i % 3]}`;
      return s;
    }));
    legend.replaceChildren(...(parts.length ? parts.map((p, i) => {
      const li = document.createElement('li');
      const sw = document.createElement('i');
      sw.style.background = swatch[i % 3];
      const b = document.createElement('b');
      b.textContent = String(Math.round(p.kcal));
      li.append(sw, `${p.f.label} ${g[p.f.id]} g`, b);
      return li;
    }) : [Object.assign(document.createElement('li'), { textContent: 'The plate is empty.' })]));

    const items = parts.map((p) => ({ food_id: p.f.id, grams: g[p.f.id] }));
    req.textContent = `calc_meal(${JSON.stringify({ items }, null, 2)})`;
  }

  rows.forEach((row) => {
    const input = row.querySelector<HTMLInputElement>('input')!;
    const out = row.querySelector<HTMLOutputElement>('output')!;
    input.addEventListener('input', () => {
      out.textContent = `${input.value} g`;
      update();
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const p = presets.find((x) => x.key === btn.dataset.preset);
      if (!p) return;
      rows.forEach((row, id) => {
        const input = row.querySelector<HTMLInputElement>('input')!;
        input.value = String(p.grams[id] ?? 0);
        row.querySelector('output')!.textContent = `${input.value} g`;
      });
      update();
    }),
  );
}
