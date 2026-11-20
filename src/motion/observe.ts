// The concept's driver (DESIGN.md, "Observed"). One variable, p: 0 is superposition, 1 is observed.
// p comes from scroll through the hero's sticky stage; the pointer stirs the ghosts and a slow
// idle drift keeps them breathing. Everything that carries the concept reads p:
//   [data-ghost]        image ghosts: offset by data-dx/dy/dr at p = 0, home at p = 1
//   [data-ghost-word]   headline ghosts set at other widths: scaleX collapses them onto [data-ghost-ref]
//   [data-readout]      the price: last digits flicker while uncertain, lock on the real value
//   [data-observe-state] the status label
// Reduced motion: the hero renders observed and nothing moves.
import { gsap } from 'gsap';
import { isTouch, onPage, prefersReducedMotion } from '@/engine';
import { formatPrice } from '@/lib/catalog';

/** The driver's live state, read by the 3D headphones (components/home/HeroModel.tsx) every frame.
 *  u: uncertainty, eased (1 = full superposition, 0 = observed). lagX/lagY: smoothed pointer, -0.5..0.5. */
export const observation = { u: 0, lagX: 0, lagY: 0 };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function startObserve() {
  onPage(() => {
    const root = document.querySelector<HTMLElement>('[data-observe]');
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add('is-observed');
      observation.u = 0;
      return;
    }
    observation.u = 1; // first frame is the superposition

    const ghosts = [...root.querySelectorAll<HTMLElement>('[data-ghost]')];
    const base = ghosts.map((g) => ({ x: +(g.dataset.dx || 0), y: +(g.dataset.dy || 0), r: +(g.dataset.dr || 0) }));
    const words = [...root.querySelectorAll<HTMLElement>('[data-ghost-word]')];
    // Each ghost word collapses onto the real line it shadows: data-ghost-word="0" ↔ data-ghost-ref="0".
    const refFor = (w: HTMLElement) => root.querySelector<HTMLElement>(`[data-ghost-ref="${w.dataset.ghostWord}"]`);
    const price = root.querySelector<HTMLElement>('[data-readout]');
    const status = root.querySelector<HTMLElement>('[data-observe-state]');
    const value = Number(price?.dataset.value || 0);
    const final = formatPrice(value);

    let ratios = words.map(() => 1);
    const measure = () => {
      ratios = words.map((w) => {
        const ref = refFor(w);
        return ref && w.offsetWidth ? ref.offsetWidth / w.offsetWidth : 1;
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    addEventListener('resize', measure);

    const pointer = { x: 0, y: 0 };
    const lag = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width - 0.5;
      pointer.y = (e.clientY - r.top) / Math.min(r.height, innerHeight) - 0.5;
    };
    const onLeave = () => { pointer.x = 0; pointer.y = 0; };
    if (!isTouch()) {
      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerleave', onLeave);
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);

    let p = 0;
    let lastFlicker = 0;
    let observed = true; // the server renders the observed state; the first frame flips it
    const tick = (time: number) => {
      if (!visible) return;
      const rect = root.getBoundingClientRect();
      const span = Math.max(1, rect.height - innerHeight);
      const target = clamp(-rect.top / (span * 0.8));
      p += (target - p) * 0.1;
      if (Math.abs(target - p) < 0.0005) p = target;
      lag.x += (pointer.x - lag.x) * 0.06;
      lag.y += (pointer.y - lag.y) * 0.06;

      const u = 1 - p; // uncertainty
      const eased = u * u * (3 - 2 * u);
      observation.u = eased;
      observation.lagX = lag.x;
      observation.lagY = lag.y;
      ghosts.forEach((g, i) => {
        const b = base[i];
        const s = i % 2 ? -1 : 1;
        gsap.set(g, {
          x: b.x * eased + Math.sin(time * 0.7 + i * 2.1) * (5 * eased + 1) + lag.x * 46 * eased * s,
          y: b.y * eased + Math.cos(time * 0.55 + i * 1.3) * (4 * eased + 0.6) + lag.y * 28 * eased * -s,
          rotate: b.r * eased,
          opacity: 0.18 + 0.72 * eased,
        });
      });
      words.forEach((w, i) => {
        gsap.set(w, {
          scaleX: lerp(1, ratios[i], p),
          x: Math.sin(time * 0.6 + i * 2.4) * 3 * eased + lag.x * 18 * eased * (i % 2 ? -1 : 1),
          opacity: 0.1 + 0.8 * eased,
        });
      });

      const nowObserved = p > 0.965;
      if (nowObserved !== observed) {
        observed = nowObserved;
        root.classList.toggle('is-observed', observed);
        if (status) status.textContent = observed ? 'Observed' : 'Superposition';
      }
      if (price) {
        if (observed) {
          if (price.textContent !== final) price.textContent = final;
        } else if (time - lastFlicker > 0.09) {
          // A measurement settling: only the last digits move, by at most 8% of the price.
          lastFlicker = time;
          const spread = Math.min(value * 0.08, 20) * eased;
          price.textContent = formatPrice(Math.max(0.01, value + (Math.random() * 2 - 1) * spread));
        }
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      removeEventListener('resize', measure);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  });
}
