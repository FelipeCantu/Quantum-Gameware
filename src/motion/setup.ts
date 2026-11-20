// Global motion for the store: runs once on the client, before the first page initializes.
//   - the "collapse" page transition: cobalt and gill ghosts arrive offset and fold into one ink panel
//   - the header steps aside on scroll down and returns on scroll up
//   - the primary-button fill and the observation driver
import { gsap } from 'gsap';
import { ease, onScroll, setTransition } from '@/engine';
import { startObserve } from './observe';
import { startFringes } from './fringes';
import { buttonFill, collapseOnView, measureOnView } from './interactions';

export function setupMotion() {
  let destination = '';
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest('a');
    // The curtain names where you are going: "/" reads as "/home", other paths as they are.
    if (a) destination = new URL(a.href, location.href).pathname.replace(/^\/$/, '/home');
  }, true);

  setTransition({
    leave: (c) => {
      const [q, g] = c.querySelectorAll<HTMLElement>('.curtain__ghost');
      const panel = c.querySelector<HTMLElement>('.curtain__panel')!;
      const label = c.querySelector<HTMLElement>('.curtain__label');
      if (label) label.textContent = destination;
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .set([q, g, panel], { yPercent: 100, xPercent: 0 })
        .to(q, { yPercent: 0, xPercent: -3, duration: 0.6, ease: ease.inOut }, 0)
        .to(g, { yPercent: 0, xPercent: 3, duration: 0.6, ease: ease.inOut }, 0.05)
        .to(panel, { yPercent: 0, duration: 0.62, ease: ease.inOut }, 0.1)
        .to([q, g], { xPercent: 0, duration: 0.3, ease: ease.soft }, 0.5);
    },
    enter: (c) => {
      const [q, g] = c.querySelectorAll<HTMLElement>('.curtain__ghost');
      const panel = c.querySelector<HTMLElement>('.curtain__panel')!;
      return gsap.timeline()
        .to(panel, { yPercent: -100, duration: 0.8, ease: ease.inOut }, 0)
        .to(g, { yPercent: -100, xPercent: 2, duration: 0.8, ease: ease.inOut }, 0.06)
        .to(q, { yPercent: -100, xPercent: -2, duration: 0.8, ease: ease.inOut }, 0.12)
        .set(c, { autoAlpha: 0 });
    },
  });

  let last = 0;
  onScroll(({ y }) => {
    if (Math.abs(y - last) < 6) return;
    document.documentElement.classList.toggle('header-away', y > 220 && y > last);
    last = y;
  });

  buttonFill();
  collapseOnView();
  measureOnView();
  startObserve();
  startFringes();
}
