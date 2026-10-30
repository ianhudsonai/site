import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Runs only when the inline script in Base.astro added `motion` to <html>, which it does only when the
// visitor has not asked for reduced motion. Everything here is enhancement: without it the page is complete.

const root = document.documentElement;
const NAV_OFFSET = 56;

function release() {
  root.classList.remove('motion');
  document.getElementById('boot')?.remove();
}

function start() {
  window.__zineReady = true;

  const css = getComputedStyle(root);
  const accent = css.getPropertyValue('--accent').trim() || '#ff5a1f';
  const ink = css.getPropertyValue('--bg').trim() || '#0b0b0c';

  /* Smooth scroll. Lerp 0.09 gives the weighty glide both reference sites use. */
  const lenis = new Lenis({ lerp: 0.09 });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  lenis.on('scroll', ScrollTrigger.update);

  /* Halftone transition: one canvas of dots whose radius is tweened from an origin point. */
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:70;pointer-events:none;display:none;';
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  const state = { p: 0 };
  let busy = false;

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener('resize', size);

  type Shape = { ox: number; oy: number; color: string; outward: boolean };
  let shape: Shape = { ox: innerWidth / 2, oy: innerHeight / 2, color: accent, outward: true };

  function draw() {
    if (!ctx) return;
    const w = innerWidth;
    const h = innerHeight;
    ctx.clearRect(0, 0, w, h);
    if (state.p <= 0) return;
    const cell = w < 640 ? 26 : 34;
    const { ox, oy, color, outward } = shape;
    const maxD = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy));
    const spread = 0.55;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let y = cell / 2; y < h + cell; y += cell) {
      for (let x = cell / 2; x < w + cell; x += cell) {
        const d = Math.hypot(x - ox, y - oy) / maxD;
        // Growing: dots near the origin start first. Shrinking: the same dots leave first, so the reveal radiates out.
        const lag = outward ? d : 1 - d;
        const local = Math.min(1, Math.max(0, (state.p - lag * spread) / (1 - spread)));
        if (local > 0) {
          const r = local * cell * 0.74;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
    }
    ctx.fill();
  }

  function sweep(to: number, duration: number, ease: string) {
    canvas.style.display = 'block';
    return new Promise<void>((resolve) => {
      gsap.to(state, {
        p: to,
        duration,
        ease,
        onUpdate: draw,
        onComplete: () => {
          // An idle canvas would sit over the whole page, so it only exists while dots are on screen.
          if (to === 0) canvas.style.display = 'none';
          resolve();
        },
      });
    });
  }

  /* Intro: the page starts under a solid cover, which dissolves as ink-coloured halftone dots shrink away. */
  shape = { ox: innerWidth * 0.5, oy: innerHeight * 0.35, color: ink, outward: false };
  state.p = 1;
  canvas.style.display = 'block';
  draw();
  document.getElementById('boot')?.remove();

  /* Reveals: content rises into place as it enters the viewport. The wrapper is animated, never a .hard card itself. */
  function armReveals() {
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          gsap.fromTo(
            e.target,
            { opacity: 0.25, y: 28 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: n++ * 0.09, clearProps: 'transform' },
          );
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
  }

  sweep(0, 0.9, 'power2.inOut').then(() => canvas.style.setProperty('pointer-events', 'none'));
  setTimeout(armReveals, 350);
  heroIntro();
  scenes(lenis);

  /* Section jumps: cover the screen from the click point, jump while hidden, then reveal. */
  async function jump(target: HTMLElement, hash: string, x: number, y: number) {
    if (busy) return;
    busy = true;
    canvas.style.pointerEvents = 'auto';
    shape = { ox: x, oy: y, color: accent, outward: true };
    await sweep(1, 0.6, 'power2.in');
    const top = target.id === 'top' ? 0 : target.getBoundingClientRect().top + scrollY - NAV_OFFSET;
    lenis.scrollTo(Math.max(0, top), { immediate: true, force: true });
    history.pushState(null, '', hash);
    target.focus({ preventScroll: true });
    shape = { ox: x, oy: y, color: accent, outward: false };
    await sweep(0, 0.8, 'power2.out');
    canvas.style.pointerEvents = 'none';
    busy = false;
  }

  document.addEventListener('click', (ev) => {
    const a = (ev.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
    const hash = a.getAttribute('href') ?? '';
    const target = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
    if (!target || a.getAttribute('href') === '#main') return;
    ev.preventDefault();
    // Keyboard activation reports no pointer position, so start from the link itself.
    const r = a.getBoundingClientRect();
    const x = ev.detail === 0 ? r.left + r.width / 2 : ev.clientX;
    const y = ev.detail === 0 ? r.top + r.height / 2 : ev.clientY;
    void jump(target, hash, x, y);
  });
}

try {
  if (root.classList.contains('motion')) start();
} catch (err) {
  console.error('motion layer failed, falling back to the static page', err);
  release();
}

declare global {
  interface Window {
    __zineReady?: boolean;
  }
}

/* The name rises out of its masks while the dust of the intro dissolve is still clearing. */
function heroIntro() {
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero="line"]');
  gsap.set(lines, { yPercent: 115 });
  const copy = document.querySelector('[data-hero="copy"]');
  const plate = document.querySelector('[data-hero="plate"]');
  const tl = gsap.timeline({ delay: 0.35, defaults: { ease: 'expo.out' } });
  tl.to(lines, { yPercent: 0, duration: 1.3, stagger: 0.1 }, 0);
  if (plate) tl.fromTo(plate, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4 }, 0.15);
  if (copy) tl.fromTo(copy, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, 0.6);

  /* The phone plate drifts slower than the page, so the name slides over it. */
  if (plate) gsap.to(plate, { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* The loop plays only while it is on screen. */
  const video = document.querySelector<HTMLVideoElement>('video[data-loop]');
  if (video) {
    new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? void video.play().catch(() => {}) : video.pause())), { threshold: 0.2 }).observe(video);
  }
}

/* The two held stages: Kilo's name tears at the seam, then three screens wipe over one another. */
function scenes(lenis: Lenis) {
  const tear = document.querySelector<HTMLElement>('.tear');
  if (tear) {
    const g = (s: string) => document.querySelector<HTMLElement>(`[data-tear="${s}"]`)!;
    const pane = innerHeight * 0.2;
    const half = innerHeight * 0.3;
    // At 0 the halves meet exactly. The section is 230svh tall, so it is held while 0.43 to 0.57 of its travel passes.
    const split = (el: HTMLElement, a: number, up: boolean) => {
      const s = up ? 1 : -1;
      gsap.timeline({ scrollTrigger: { trigger: tear, start: 'top bottom', end: 'bottom top', scrub: 0.4 } })
        .fromTo(el, { y: s * a }, { y: 0, duration: 0.43, ease: 'none' })
        .to(el, { y: 0, duration: 0.14 })
        .to(el, { y: -s * a, duration: 0.43, ease: 'none' });
    };
    split(g('l'), pane, true);
    split(g('r'), pane, false);
    split(g('tl'), half, true);
    split(g('tr'), half, false);
  }

  const story = document.querySelector<HTMLElement>('[data-story]');
  if (story) {
    const steps = [...story.querySelectorAll<HTMLElement>('.step')];
    const tl = gsap.timeline({ scrollTrigger: { trigger: story, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
    tl.to({}, { duration: 0.7 })
      .to(steps[1], { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power2.inOut' })
      .to({}, { duration: 0.7 })
      .to(steps[2], { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power2.inOut' })
      .to({}, { duration: 0.7 });

    // Tabs jump to the scroll position that shows their screen.
    const total = 0.7 * 3 + 2;
    const marks = [0.35 / total, (0.7 + 1 + 0.35) / total, (total - 0.35) / total];
    story.querySelectorAll<HTMLAnchorElement>('[data-tab]').forEach((a) =>
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const i = Number(a.dataset.tab);
        const st = ScrollTrigger.getAll().find((t) => t.trigger === story);
        if (!st) return;
        lenis.scrollTo(st.start + (st.end - st.start) * marks[i] , { duration: 1.1 });
      }),
    );
  }

  // The footer wordmark rises into place as the footer comes up.
  const mark = document.querySelector<HTMLElement>('[data-rise]');
  if (mark) gsap.fromTo(mark, { yPercent: 38 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'top 25%', scrub: true } });
  ScrollTrigger.refresh();
}
