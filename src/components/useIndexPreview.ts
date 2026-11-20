'use client';
// Floating photo preview for index lists (home categories, about brands). On fine pointers the
// preview rides a fixed column (centre-right of the hovered row), clear of the names and the
// counts, and follows the pointer only vertically. Touch and reduced motion get the rows' inline thumbs instead (CSS).
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { usePage } from '@/engine/next';
import { isTouch, prefersReducedMotion } from '@/engine';

export function useIndexPreview(
  listRef: RefObject<HTMLElement | null>,
  previewRef: RefObject<HTMLElement | null>,
  onHide: () => void,
) {
  usePage(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview || isTouch() || prefersReducedMotion()) return;
    const x = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3.out' });
    // x sits at 60% of the hovered row, so multi-column lists keep the preview in its own column.
    const move = (e: PointerEvent) => {
      const r = list.getBoundingClientRect();
      const row = (e.target as Element).closest('.index__row')?.getBoundingClientRect();
      if (row) x(row.left - r.left + row.width * 0.6);
      y(e.clientY - r.top);
    };
    // pointerleave does not fire when the page scrolls under a still pointer, so while the pointer
    // is over the list a ticker check catches it; the check runs only during that time.
    const check = () => {
      if (!list.matches(':hover')) hide();
    };
    const hide = () => {
      onHide();
      gsap.ticker.remove(check);
    };
    const enter = () => gsap.ticker.add(check);
    list.addEventListener('pointerenter', enter);
    list.addEventListener('pointermove', move);
    list.addEventListener('pointerleave', hide);
    return () => {
      list.removeEventListener('pointerenter', enter);
      list.removeEventListener('pointermove', move);
      list.removeEventListener('pointerleave', hide);
      gsap.ticker.remove(check);
    };
  });
}
