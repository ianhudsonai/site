/* The hero's glyph field: a grid of tiny characters behind the name. They brighten under the pointer and a click sends a
   ring of yellow characters outward. It is drawn on a canvas, only while something is moving. With reduced motion it is
   drawn once and stays still. */

const hero = document.querySelector<HTMLElement>('.hero');
const canvas = hero?.querySelector<HTMLCanvasElement>('[data-field]');
if (hero && canvas) init(hero, canvas);

function init(hero: HTMLElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const css = getComputedStyle(document.documentElement);
  const ink = css.getPropertyValue('--fg').trim() || '#edebe7';
  const accent = css.getPropertyValue('--accent').trim() || '#f3d438';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CELL_W = 11;
  const CELL_H = 19;
  const RAMP = ' .:-=+*#%@';
  const REACH = 150; // how far the pointer lights the field, in px
  const RING_START = 130; // a ring opens from 130 px to 230 px in one second and is gone after two
  const RING_GROW = 100;
  const RING_BAND = 30;

  let w = 0;
  let h = 0;
  let cols = 0;
  let rows = 0;
  let visible = true;
  let raf = 0;
  let lastMove = -1e9;
  const ptr = { x: -999, y: -999, tx: -999, ty: -999, v: 0 };
  const rings: { x: number; y: number; t0: number }[] = [];

  // A cheap integer hash gives every cell a fixed random number, so the field never reshuffles.
  const hash = (x: number, y: number) => {
    let n = (x * 374761393 + y * 668265263) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  };

  function draw(now: number) {
    ctx!.clearRect(0, 0, w, h);
    const t = now / 1000;
    let color = '';
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = i * CELL_W + CELL_W / 2;
        const y = j * CELL_H + CELL_H / 2;
        const hv = hash(i, j);
        let v = hv > 0.86 ? 0.16 + (still ? 0 : 0.08 * Math.sin(t * 0.8 + hv * 40)) : 0;
        let ring = 0;
        if (!still) {
          const d = Math.hypot(x - ptr.x, y - ptr.y);
          if (d < REACH) v += (1 - d / REACH) ** 1.5 * 1.1 * ptr.v;
          for (const g of rings) {
            const age = now - g.t0;
            const radius = RING_START + RING_GROW * (1 - (1 - Math.min(1, age / 1000)) ** 3);
            const off = Math.abs(Math.hypot(x - g.x, y - g.y) - radius);
            if (off < RING_BAND) ring = Math.max(ring, (1 - off / RING_BAND) * Math.max(0, 1 - age / 2000));
          }
        }
        v = Math.min(1, v + ring * 0.9);
        if (v < 0.06) continue;
        const idx = Math.min(RAMP.length - 1, 1 + Math.floor(v * (RAMP.length - 1)));
        const fill = ring > 0.1 ? accent : ink;
        if (fill !== color) ctx!.fillStyle = color = fill;
        ctx!.globalAlpha = Math.min(0.9, 0.12 + v * 0.8);
        ctx!.fillText(RAMP[idx], x, y);
      }
    }
    ctx!.globalAlpha = 1;
  }

  function tick(now: number) {
    raf = 0;
    if (!visible) return;
    ptr.x += (ptr.tx - ptr.x) * 0.2;
    ptr.y += (ptr.ty - ptr.y) * 0.2;
    ptr.v += ((now - lastMove < 1500 ? 1 : 0) - ptr.v) * 0.08;
    while (rings.length && now - rings[0].t0 > 2000) rings.shift();
    draw(now);
    if (ptr.v > 0.01 || rings.length) raf = requestAnimationFrame(tick);
  }
  const wake = () => {
    if (!raf && visible) raf = requestAnimationFrame(tick);
  };

  function size() {
    const r = hero.getBoundingClientRect();
    w = r.width;
    h = r.height;
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.font = `600 14px "JetBrains Mono Variable", ui-monospace, monospace`; // taste-skill-ignore: the field is decorative characters on a canvas, not text a visitor reads
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    cols = Math.ceil(w / CELL_W);
    rows = Math.ceil(h / CELL_H);
    draw(performance.now());
  }

  const local = (e: PointerEvent) => {
    const r = hero.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const ready = document.fonts?.load('600 14px "JetBrains Mono Variable"') ?? Promise.resolve(); // taste-skill-ignore: same face as the field above
  Promise.race([ready, new Promise((res) => setTimeout(res, 1500))]).then(() => {
    size();
    new ResizeObserver(size).observe(hero);
    if (still) return;

    hero.addEventListener('pointermove', (e) => {
      const p = local(e);
      if (ptr.v < 0.02) {
        ptr.x = p.x;
        ptr.y = p.y;
      }
      ptr.tx = p.x;
      ptr.ty = p.y;
      lastMove = performance.now();
      wake();
    });
    hero.addEventListener('pointerdown', (e) => {
      const p = local(e);
      rings.push({ x: p.x, y: p.y, t0: performance.now() });
      ptr.x = ptr.tx = p.x;
      ptr.y = ptr.ty = p.y;
      lastMove = performance.now();
      wake();
    });
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) wake();
    }).observe(hero);
  });
}
