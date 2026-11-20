// Micro-interactions, one treatment per role (DESIGN.md):
//   [data-fill]     primary buttons: the quantum fill floods in from the side the pointer entered.
//   [data-collapse] server-rendered superpositions (footer wordmark, page heads): collapse in view.
//   [data-measure]  real numbers (about facts): digits flicker through uncertain values, then lock
//                   left to right, once, when they come into view. The final text is server-rendered.
import { gsap } from 'gsap';
import { ease, isTouch, onPage, prefersReducedMotion } from '@/engine';

export const measureOnView = () => onPage(() => {
  if (prefersReducedMotion()) return;
  const run = (el: HTMLElement) => {
    const final = el.textContent || '';
    const t = { p: 0 };
    gsap.to(t, {
      p: 1,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        const locked = Math.floor(t.p * (final.length + 1));
        el.textContent = [...final].map((c, i) => (i < locked || !/\d/.test(c) ? c : String((Math.random() * 10) | 0))).join('');
      },
      onComplete: () => { el.textContent = final; },
    });
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      run(e.target as HTMLElement);
    });
  }, { rootMargin: '0px 0px -15% 0px' });
  document.querySelectorAll('[data-measure]').forEach((el) => io.observe(el));
  return () => io.disconnect();
});

export const collapseOnView = () => onPage(() => {
  if (prefersReducedMotion()) return; // CSS shows the collapsed state
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-observed');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-collapse]:not(.is-observed)').forEach((el) => io.observe(el));
  return () => io.disconnect();
});

export const buttonFill = () => onPage(() => {
  if (isTouch() || prefersReducedMotion()) return; // CSS covers these
  const off: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-fill]').forEach((btn) => {
    const fill = btn.querySelector<HTMLElement>('.btn__fill');
    if (!fill) return;
    const from = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      return `${e.clientX - r.left}px ${e.clientY - r.top}px`;
    };
    let closed = true;
    const open = (at: string) => {
      if (closed) gsap.set(fill, { clipPath: `circle(0% at ${at})` });
      closed = false;
      btn.classList.add('is-filled');
      gsap.to(fill, { clipPath: `circle(150% at ${at})`, duration: 0.55, ease: ease.soft, overwrite: true });
    };
    const close = (at: string) => {
      btn.classList.remove('is-filled');
      gsap.to(fill, { clipPath: `circle(0% at ${at})`, duration: 0.45, ease: ease.soft, overwrite: true, onComplete: () => { closed = true; } });
    };
    const enter = (e: PointerEvent) => open(from(e));
    const leave = (e: PointerEvent) => close(from(e));
    const focus = () => btn.matches(':focus-visible') && open('50% 50%');
    const blur = () => close('50% 50%');
    btn.addEventListener('pointerenter', enter);
    btn.addEventListener('pointerleave', leave);
    btn.addEventListener('focus', focus);
    btn.addEventListener('blur', blur);
    off.push(() => {
      btn.removeEventListener('pointerenter', enter);
      btn.removeEventListener('pointerleave', leave);
      btn.removeEventListener('focus', focus);
      btn.removeEventListener('blur', blur);
    });
  });
  return () => off.forEach((f) => f());
});
