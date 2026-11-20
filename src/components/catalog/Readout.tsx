'use client';
// Result count as a measurement (DESIGN.md, collapse verb applied to data): when the count changes
// its digits flicker through uncertain values, then lock on the real number, left to right.
// Runs on the GSAP ticker; under reduced motion the number just changes.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/engine';

export default function Readout({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown.current === value) return;
    shown.current = value;
    const final = String(value);
    if (prefersReducedMotion()) {
      el.textContent = final;
      return;
    }
    const n = final.length;
    const t = { p: 0 };
    const tween = gsap.to(t, {
      p: 1,
      duration: 0.55,
      ease: 'power2.out',
      onUpdate: () => {
        // Digits lock from the left as p rises; the rest keep flickering.
        const locked = Math.floor(t.p * (n + 1));
        let s = '';
        for (let i = 0; i < n; i++) s += i < locked ? final[i] : String(Math.floor(Math.random() * 10));
        el.textContent = s;
      },
      onComplete: () => { el.textContent = final; },
    });
    return () => { tween.kill(); el.textContent = final; };
  }, [value]);

  return (
    <span ref={ref} className={`mono ${className}`} aria-hidden="true">
      {value}
    </span>
  );
}
